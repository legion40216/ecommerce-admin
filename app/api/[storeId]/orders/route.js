import { z } from 'zod';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

const corsHeaders = {
    'Access-Control-Allow-Origin': "*",  
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
    return NextResponse.json({}, {headers: corsHeaders})
}

const customerInfoSchema = z.object({
  customerName: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  address: z.string().min(5, { message: 'Please enter a valid address.' }),
  city: z.string().min(2, { message: 'Please enter a valid city.' }),
  country: z.string().min(2, { message: 'Please enter a valid country.' }),
  postalCode: z.string().min(5, { message: 'Please enter a valid postal code.' }),
});

export async function POST(request, { params }) {
  try {
    
    const body = await request.json();
    
    const {
      customerName,
      email,
      phone,
      address,
      city,
      country,
      postalCode,
      items,
      totalPrice,
      paymentMethod,
    } = body;
    
    // Validate customer information
    try {
      customerInfoSchema.parse({
        customerName,
        email,
        phone,
        address,
        city,
        country,
        postalCode
      });
    } catch (validationError) {
      return NextResponse.json(
        { error: validationError.errors },
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    // Validate other required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    if (typeof totalPrice !== 'number' || totalPrice <= 0) {
      return NextResponse.json(
        { error: "Valid total price is required" },
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        {
          status: 400,
          headers: corsHeaders
        }
      );
    }
    
    // Extract and validate storeId 
    const { storeId } = params;
    if(!storeId) {
        return NextResponse.json(
            { error: "Store and Order ID is required" },
            { status: 400 }
        );
    }

    // Ensure the store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      });
      if (!store) {
        return NextResponse.json(
          { error: "Store not found" },
          { status: 400 }
      );
      }

    let orderData = {
      customerName,
      email,
      phone,
      address,
      city,
      country,
      postalCode,
      totalPrice,
      paymentMethod,
      storeId,
      isPaid: false,
      orderItems: {
        create: items.map(item => ({
          productId: item.id,
          price: item.price,
          count: item.count, // Include the count as quantity
        })),
      },
    };
    
    if (paymentMethod === 'stripe') {
      // Implement Stripe payment intent creation here
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      // const paymentIntent = await stripe.paymentIntents.create({
      //   amount: Math.round(totalPrice * 100),
      //   currency: 'usd',
      //   automatic_payment_methods: { enabled: true }
      // });
      // orderData.paymentIntentId = paymentIntent.id;
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    
    return NextResponse.json(order, {
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('[ORDER_POST]', error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: corsHeaders 
      }
    );
  }
}