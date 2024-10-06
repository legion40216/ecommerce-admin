import React from 'react';
import prisma from '@/lib/prismadb';
import LusterClient from './_components/client';
import { format } from 'date-fns';

export default async function Page({ params }) {
  const lusters = await prisma.luster.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedLusters = lusters.map((item) => ({
    id: item.id,
    type: item.type,
    createdAt:  format(item.createdAt, "MMMM do, yyyy")
  }));

  return (
    <div>
      <LusterClient data={formattedLusters} />
    </div>
  );
}
