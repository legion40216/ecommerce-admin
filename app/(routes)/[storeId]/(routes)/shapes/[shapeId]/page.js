import React from 'react';
import prisma from '@/lib/prismadb';
import ShapeForm from './_components/shape-form'; // Renamed from SizeForm

export default async function Page({ params }) {
  // Access the parameter with correct casing
  const shape = await prisma.shape.findUnique({
    where: {
      id: params.shapeId, // Ensure 'shapeId' matches the route file name
    },
  });

  return (
    <div>
      <ShapeForm initialData={shape} />
    </div>
  );
}
