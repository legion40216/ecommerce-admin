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

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    const { customerInfo, items, totalPrice, paymentMethod } = body;
    
        if (!customerInfo || !items || typeof totalPrice !== 'number' || !paymentMethod) {
          return new NextResponse("Missing required fields", { status: 400 });
        }
    
        if (!params.storeId) {
          return new NextResponse("Store is required", { status: 400 });
        }
    
        const { storeId } = params;
    
        let orderData = {
          customerName: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address,
          city: customerInfo.city,
          country: customerInfo.country,
          postalCode: customerInfo.postalCode,
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
          // const paymentIntent = await stripe.paymentIntents.create({...});
          // orderData.paymentIntentId = paymentIntent.id;
        }
    
        const order = await prisma.order.create({ data: orderData });
    
        return NextResponse.json(order, { headers: corsHeaders });
      } catch (error) {
        console.error('[order_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
      }
    }

