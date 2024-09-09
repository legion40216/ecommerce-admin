import React from 'react'
import prisma from '@/lib/prismadb';

import { format } from 'date-fns';
import SizeClient from './_components/client';
import ColorClient from './_components/client';

export default async function page({params}) {

  const colors = await prisma.color.findMany({
    where: {
        storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedcolors = colors.map((item)=>({
    id:         item.id,
    name:       item.name,
    value:      item.value,
    createdAt:  format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div>
        <ColorClient
        data = {formattedcolors}
        />
    </div>
  )
}
