'use client';

import { useMemo } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

interface StripeCheckoutEmbedProps {
  clientSecret: string;
  publishableKey: string;
}

export function StripeCheckoutEmbed({ clientSecret, publishableKey }: StripeCheckoutEmbedProps) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);
  const options = { clientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
