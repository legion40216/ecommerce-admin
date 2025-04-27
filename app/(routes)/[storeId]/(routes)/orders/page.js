import React from 'react'
import prisma from '@/lib/prismadb';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';
import OrderClient from './_components/client';

export default async function page({params}) {
  const orders = await prisma.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedOrders = orders.map((item) => ({
    id: item.id,
    customerName: item.customerName,
    phone: item.phone,
    address: item.address,
    totalPrice: formatter.format(item.totalPrice),
    isPaid: item.isPaid,
    paymentMethod: item.paymentMethod,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    products: item.orderItems.map(orderItem => ({
      name: orderItem.product.name,
      id: orderItem.product.id
    })) // Removed extra array wrapping
  }));
  
  return (
    <div>
      <OrderClient data={formattedOrders} />
    </div>
  )
}