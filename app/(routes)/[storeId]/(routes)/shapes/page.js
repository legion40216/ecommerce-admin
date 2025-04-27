import React from 'react';
import prisma from '@/lib/prismadb';
import { format } from 'date-fns';
import ShapeClient from './_components/client'; // Update the import to ShapeClient

export default async function Page({ params }) {
  // Fetch shapes instead of sizes
  const shapes = await prisma.shape.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Format the shapes data
  const formattedShapes = shapes.map((shape) => ({
    id:        shape.id,
    name:      shape.name,
    createdAt: format(shape.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div>
      <ShapeClient 
        data={formattedShapes}
      />
    </div>
  );
}