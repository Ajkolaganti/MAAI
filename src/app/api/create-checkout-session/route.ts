import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminAuth } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
});

const PLANS = {
  pro: {
    price: 'price_XXXXX', // Replace with your Stripe price ID
    credits: 100
  },
  ultra: {
    price: 'price_XXXXX', // Replace with your Stripe price ID
    credits: 500
  }
};

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json();
    
    if (!plan || !userId || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json(
        { error: 'Invalid plan or user ID' },
        { status: 400 }
      );
    }

    // Get user data
    const user = await adminAuth.getUser(userId);
    if (!user.email) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: PLANS[plan as keyof typeof PLANS].price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 