import { auth } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function PATCH(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await request.json();
    console.log(body)
    const { isPaid } = body;

    if (typeof isPaid !== 'boolean') {
      return new NextResponse("Invalid isPaid value", { status: 400 });
    }

    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const { orderId } = params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    if (order.paymentMethod !== 'cod') {
      return new NextResponse("Only COD orders can be manually updated", { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { isPaid },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('[order_PATCH]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.orderId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Delete associated orderItems first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: params.orderId,
      },
    });

    // Then delete the order
    await prisma.order.delete({
      where: {
        id: params.orderId,
      },
    });

    return NextResponse.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error('[ORDER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}