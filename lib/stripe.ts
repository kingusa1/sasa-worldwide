/**
 * Stripe Utility Functions
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

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
  try {
    let productId = existingProductId;

    // Create or update product
    if (productId) {
      await stripe.products.update(productId, {
        name: projectName,
        active: true,
        metadata: {
          project_id: projectId,
        },
      });
    } else {
      const product = await stripe.products.create({
        name: projectName,
        active: true,
        metadata: {
          project_id: projectId,
        },
      });
      productId = product.id;
    }

    // Create new price (prices are immutable in Stripe)
    // Archive old price if it exists
    if (existingPriceId) {
      await stripe.prices.update(existingPriceId, {
        active: false,
      });
    }

    const stripePrice = await stripe.prices.create({
      product: productId,
      currency: 'aed', // UAE Dirham
      unit_amount: Math.round(price * 100), // Convert to cents
      metadata: {
        project_id: projectId,
      },
    });

    return {
      productId,
      priceId: stripePrice.id,
    };

  } catch (error: any) {
    console.error('Stripe product/price creation error:', error);
    throw new Error(`Failed to create Stripe product/price: ${error.message}`);
  }
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
  priceId: string,
  customerEmail: string,
  metadata: {
    transaction_id: string;
    project_id: string;
    salesperson_id: string;
  },
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata,
      payment_intent_data: { metadata },
      customer_email: customerEmail,
      success_url: successUrl,
      cancel_url: cancelUrl,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes
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
