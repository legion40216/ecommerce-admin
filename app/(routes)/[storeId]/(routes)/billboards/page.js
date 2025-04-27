import React from 'react'
import prisma from '@/lib/prismadb';

import BillboardClient from './_components/client';
import { format } from 'date-fns';

export default async function page({params}) {
  
  const billboards = await prisma.billboard.findMany({
    where: {
        storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedBillboards = billboards.map((billboard)=>({
    id:         billboard.id,
    label:      billboard.label,
    createdAt:  format(billboard.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div>
        <BillboardClient
          data={formattedBillboards}
        />
    </div>
    
  )
}
