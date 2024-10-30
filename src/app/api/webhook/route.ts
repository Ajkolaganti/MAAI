import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

const PLANS = {
  pro: {
    credits: 100
  },
  ultra: {
    credits: 500
  }
};

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, plan } = session.metadata!;

    // Update user's plan and credits in Firestore
    const userRef = adminDb.collection('users').doc(userId);
    await userRef.set({
      plan,
      credits: {
        total: PLANS[plan as keyof typeof PLANS].credits,
        used: 0 // Reset used credits when upgrading
      },
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription
    }, { merge: true });
  }

  return NextResponse.json({ received: true });
} 