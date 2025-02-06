import Stripe from 'stripe';
import config from '../../config';

const stripe = new Stripe(config.stripe_secret_key as string);

export const createPaymentIntent = async ({
  totalPrice,
}: {
  totalPrice: number;
}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(totalPrice * 100),
    currency: 'usd',
    payment_method_types: ['card', 'link'],
  });
  return paymentIntent;
};

export const refundPaymentIntent = async ({paymentIntentId}:{paymentIntentId: string}) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    paymentIntentId,
  );
  const charges = await stripe.charges.list({
    payment_intent: paymentIntent.id,
  });
  const chargeId = charges.data[0]?.id;
  const refund = await stripe.refunds.create({
    charge: chargeId,
  });
  return refund;
}