/**
 * Stripe Utility Functions
 * Supports test/live mode toggle via app_settings table
 */

import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase/server';

// Cache stripe mode to avoid hitting DB on every call
let cachedStripeMode: 'test' | 'live' | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 1 minute

/**
 * Get current Stripe mode from database (cached)
 */
export async function getStripeMode(): Promise<'test' | 'live'> {
  const now = Date.now();
  if (cachedStripeMode && (now - cacheTimestamp) < CACHE_TTL) {
    return cachedStripeMode;
  }
  try {
    const { data } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', 'stripe_mode')
      .single();
    cachedStripeMode = data?.value === 'test' ? 'test' : 'live';
  } catch {
    cachedStripeMode = 'live'; // fallback to live
  }
  cacheTimestamp = now;
  return cachedStripeMode;
}

/**
 * Invalidate the cached mode (call after admin changes mode)
 */
export function invalidateStripeModeCache() {
  cachedStripeMode = null;
  cacheTimestamp = 0;
}

/**
 * Get a Stripe instance with the correct key based on current mode
 */
export async function getStripe(): Promise<Stripe> {
  let mode = await getStripeMode();

  // If test mode is selected but test keys aren't configured, fall back to live
  if (mode === 'test' && !process.env.STRIPE_TEST_SECRET_KEY) {
    console.warn('Stripe test mode selected but STRIPE_TEST_SECRET_KEY not set, falling back to live mode');
    mode = 'live';
  }

  const secretKey = mode === 'test'
    ? process.env.STRIPE_TEST_SECRET_KEY
    : process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(`STRIPE_SECRET_KEY not set`);
  }

  return new Stripe(secretKey.trim(), {
    apiVersion: '2026-01-28.clover' as any,
    typescript: true,
  });
}

/**
 * Get the correct publishable key based on current mode
 */
export async function getStripePublishableKey(): Promise<string> {
  let mode = await getStripeMode();
  if (mode === 'test' && !process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY) {
    mode = 'live';
  }
  const key = mode === 'test'
    ? process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY
    : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  return key || '';
}

/**
 * Get the correct webhook secret based on current mode
 */
export async function getWebhookSecret(): Promise<string> {
  const mode = await getStripeMode();
  return mode === 'test'
    ? (process.env.STRIPE_TEST_WEBHOOK_SECRET || '')
    : (process.env.STRIPE_WEBHOOK_SECRET || '');
}

// Backwards-compatible default instance (always live)
export const stripe = new Stripe(
  (process.env.STRIPE_SECRET_KEY || 'sk_missing').trim(),
  { apiVersion: '2026-01-28.clover' as any, typescript: true }
);

/**
 * Create or update Stripe product for a project
 */
export async function createOrUpdateStripeProduct(
  projectId: string,
  projectName: string,
  price: number,
  existingProductId?: string,
  existingPriceId?: string
): Promise<{ productId: string; priceId: string }> {
  const stripeClient = await getStripe();
  try {
    let productId = existingProductId;

    if (productId) {
      await stripeClient.products.update(productId, {
        name: projectName,
        active: true,
        metadata: { project_id: projectId },
      });
    } else {
      const product = await stripeClient.products.create({
        name: projectName,
        active: true,
        metadata: { project_id: projectId },
      });
      productId = product.id;
    }

    if (existingPriceId) {
      await stripeClient.prices.update(existingPriceId, { active: false });
    }

    const stripePrice = await stripeClient.prices.create({
      product: productId,
      currency: 'aed',
      unit_amount: Math.round(price * 100),
      metadata: { project_id: projectId },
    });

    return { productId, priceId: stripePrice.id };
  } catch (error: any) {
    console.error('Stripe product/price creation error:', error);
    throw new Error(`Failed to create Stripe product/price: ${error.message}`);
  }
}

/**
 * Create Stripe products for multiple products in a project
 */
export async function createStripeProducts(
  projectId: string,
  products: Array<{ name: string; price: number }>
): Promise<Array<{ name: string; price: number; stripe_product_id: string; stripe_price_id: string }>> {
  const results = [];
  for (const product of products) {
    const { productId, priceId } = await createOrUpdateStripeProduct(
      projectId, product.name, product.price
    );
    results.push({
      name: product.name,
      price: product.price,
      stripe_product_id: productId,
      stripe_price_id: priceId,
    });
  }
  return results;
}

/**
 * Create Stripe Embedded Checkout session
 */
export async function createEmbeddedCheckoutSession(
  priceId: string,
  customerEmail: string,
  metadata: { transaction_id: string; project_id: string; salesperson_id: string },
  returnUrl: string
): Promise<string> {
  const stripeClient = await getStripe();
  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata,
      payment_intent_data: { metadata },
      customer_email: customerEmail,
      ui_mode: 'embedded',
      return_url: returnUrl,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    if (!session.client_secret) {
      throw new Error('Stripe client secret not generated');
    }
    return session.client_secret;
  } catch (error: any) {
    console.error('Stripe embedded checkout session error:', error);
    throw new Error(`Failed to create embedded checkout session: ${error.message}`);
  }
}

/**
 * Create Stripe checkout session (hosted redirect)
 */
export async function createCheckoutSession(
  priceId: string,
  customerEmail: string,
  metadata: { transaction_id: string; project_id: string; salesperson_id: string },
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const stripeClient = await getStripe();
  try {
    const session = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      metadata,
      payment_intent_data: { metadata },
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    if (!session.url) {
      throw new Error('Stripe session URL not generated');
    }
    return session.url;
  } catch (error: any) {
    console.error('Stripe checkout session creation error:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}
