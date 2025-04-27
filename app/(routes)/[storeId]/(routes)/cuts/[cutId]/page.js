import React from 'react';
import prisma from '@/lib/prismadb';
import CutForm from './_components/cut-form'; // Assuming CutForm is already created

export default async function Page({ params }) {
  const cut = await prisma.cut.findUnique({
    where: {
      id: params.cutId,
    },
  });

  return (
    <div>
      <CutForm initialData={cut} />
    </div>
  );
}