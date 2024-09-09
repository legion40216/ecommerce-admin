import React from 'react'

import prisma from '@/lib/prismadb';
import ProductForm from './_components/product-form';

export default async function page({params}) {
  
    const product = await prisma.product.findUnique({
      where: {
          id: params.productId,
      },
      include: {
        images: true
      }
  })

  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId
    }
  });
  
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId
    }
  });
  
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId
    }
  });
  
  return (
    <div>
        <ProductForm
          categories={categories}
          sizes={sizes}
          colors={colors}
          initialData={product}
        />
    </div>
  )
}
