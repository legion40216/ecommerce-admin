import React from 'react';
import prisma from '@/lib/prismadb';
import LusterForm from './_components/luster-form';

export default async function Page({ params }) {
  const luster = await prisma.luster.findUnique({
    where: {
      id: params.lusterId,
    },
  });

  return (
    <div>
      <LusterForm initialData={luster} />
    </div>
  );
}
