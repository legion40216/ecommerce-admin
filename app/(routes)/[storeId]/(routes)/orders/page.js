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
    phone: item.phone,
    address: item.address,
    totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
      return total + Number(item.product.price)
    }, 0)),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div>
        <OrderClient
          data={formattedOrders}
        />
    </div>
    
  )
}
