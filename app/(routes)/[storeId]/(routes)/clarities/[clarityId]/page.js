import React from 'react';
import prisma from '@/lib/prismadb';
import ClarityForm from './_components/clarity-form'; // Assuming ClarityForm is already created

export default async function Page({ params }) {
  const clarity = await prisma.clarity.findUnique({
    where: {
      id: params.clarityId,
    },
  });

  return (
    <div>
      <ClarityForm initialData={clarity} />
    </div>
  );
}
