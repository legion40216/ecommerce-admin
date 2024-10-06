import React from 'react'
import prisma from '@/lib/prismadb';

import { format } from 'date-fns';
import ClarityClient from './_components/client';

export default async function page({params}) {

  const clarity = await prisma.clarity.findMany({
    where: {
        storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedClarity = clarity.map((item)=>({
    id:         item.id,
    name:       item.name,
    value:      item.value,
    createdAt:  format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div>
        <ClarityClient 
        data = {formattedClarity}
        />
    </div>
  )
}
