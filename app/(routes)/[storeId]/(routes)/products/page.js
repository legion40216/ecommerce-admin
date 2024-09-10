import React from 'react'
import prisma from '@/lib/prismadb';


import { format } from 'date-fns';
import { formatter } from '@/lib/utils';
import ProductClient from './_components/client';

export default async function page({params}) {

  const products = await prisma.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts = products.map((item) => ({
    id:         item.id,
    name:       item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price:      formatter.format(item.price.toNumber()), // Convert Decimal to number
    category:   item.category.name,
    size:       item.size.name, // Corrected field
    color:      item.color.value,
    createdAt:  format(item.createdAt, "MMMM do, yyyy") // Format date
  }));

  return (
    <div>
        <ProductClient
        data={formattedProducts}
        />
    </div>
    
  )
}
