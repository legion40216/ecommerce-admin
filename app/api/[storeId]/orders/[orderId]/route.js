import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { Prisma } from '@prisma/client';

export async function PATCH(request, { params }) {
  try {
    // Authenticate user
    const { userId } = auth(); 
    if (!userId) {
        return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
        );
    }

    // Extract and validate storeId 
    const { storeId, orderId } = params;
    if(!storeId || !orderId) {
        return NextResponse.json(
            { error: "Store ID and Order ID is required" },
            { status: 400 }
        );
    }
    
    // 3. Verify store ownership
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Store not found" }, 
        { status: 404 }
      );
    }

    const body = await request.json();
    
    const { isPaid } = body;

    if (typeof isPaid !== 'boolean') {
      return new NextResponse(
        "Invalid isPaid value", 
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json (
        { error: "Order not found" },
        { status: 404 }
     )
    }

    if (order.paymentMethod !== 'cod') {
      return new NextResponse(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { 
        id: orderId,
        storeId: store.id

       },
      data: { isPaid },
    });

    return NextResponse.json(
      { success: true, updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error('[order_PATCH]', error);
    // Handle not found error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Billboard not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Authenticate user
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Extract and validate parameters
    const { orderId, storeId } = params;
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    } if (!storeId) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    // 3. Verify store ownership
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });
    if (!store) {
      return NextResponse.json(
        { error: "Store not found" }, 
        { status: 404 }
      );
    }

    // Delete associated order items first
    await prisma.orderItem.deleteMany({
      where: { orderId },
    });

    // Then delete the order
    const order = await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json(
      { success: true, 
        message: "Order deleted successfully", 
        order
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[ORDER_DELETE]', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: "Billboard not found" },
          { status: 404 }
        );
      }
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
