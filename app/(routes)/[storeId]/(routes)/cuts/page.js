import React from 'react'
import prisma from '@/lib/prismadb';

import { format } from 'date-fns';
import CutClient from './_components/client';

export default async function page({params}) {

  const cut = await prisma.cut.findMany({
    where: {
        storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedCut = cut.map((item)=>({
    id:         item.id,
    grade:      item.grade,
    createdAt:  format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div>
        <CutClient 
        data = {formattedCut}
        />
    </div>
  )
}
