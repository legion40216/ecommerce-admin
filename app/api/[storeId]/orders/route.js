import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    try {
        // CORS Headers
        const corsHeaders = {
            'Access-Control-Allow-Origin': 'https://ecommerce-frontend.vercel.app', // Replace with your actual frontend URL
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle OPTIONS request for CORS preflight
        if (request.method === 'OPTIONS') {
            return new NextResponse(null, {
                status: 200,
                headers: corsHeaders,
            });
        }

        // Authenticate user
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401, headers: corsHeaders });
        }

        // Parse request body
        const body = await request.json();
        const { customerInfo, items, totalPrice, paymentMethod } = body;

        // Validate request data
        if (!customerInfo || !items || typeof totalPrice !== 'number' || !paymentMethod) {
            return new NextResponse("Missing required fields", { status: 400, headers: corsHeaders });
        }

        // Ensure storeId is present in the request
        if (!params.storeId) {
            return new NextResponse("Store is required", { status: 400, headers: corsHeaders });
        }

        const { storeId } = params;

        // Create the order in the database
        const order = await prisma.order.create({
            data: {
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
                items: {
                    create: items.map(item => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
        });

        // Respond with the created order
        return new NextResponse(JSON.stringify(order), {
            status: 201,
            headers: corsHeaders,
        });

    } catch (error) {
        console.error('[order_POST]', error);
        return new NextResponse("Internal error", { status: 500, headers: corsHeaders });
    }
}
