// page.js

import React from 'react';
import prisma from '@/lib/prismadb';
import ProductForm from './_components/product-form';

export default async function Page({ params }) {
  const { productId, storeId } = params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const [
    categories,
    sizes,
    colors,
    clarities,
    cuts,
    lusters,
    shapes,
    zodiac
  ] = await Promise.all([
    prisma.category.findMany({
      where: { storeId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.size.findMany({
      where: { storeId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.color.findMany({
      where: { storeId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.clarity.findMany({
      where: { storeId },
      orderBy: { grade: 'asc' },
      select: { id: true, grade: true },
    }),
    prisma.cut.findMany({
      where: { storeId },
      orderBy: { grade: 'asc' },
      select: { id: true, grade: true },
    }),
    prisma.luster.findMany({
      where: { storeId },
      orderBy: { type: 'asc' },
      select: { id: true, type: true },
    }),
    prisma.shape.findMany({
      where: { storeId },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
    prisma.zodiac.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ]);

  const formattedProduct = product
    ? {
        ...product,
        price: product.price.toNumber(),
      }
    : null;
      console.log(formattedProduct)
  return (
    <div>
      <ProductForm
        categories={categories}
        sizes={sizes}
        colors={colors}
        clarities={clarities}
        cuts={cuts}
        lusters={lusters}
        shapes={shapes}
        initialData={formattedProduct}
        storeId={storeId}
        zodiac={zodiac}
      />
    </div>
  );
}
