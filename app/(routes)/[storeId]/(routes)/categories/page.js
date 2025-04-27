import React from 'react'
import prisma from '@/lib/prismadb';

import { format } from 'date-fns';
import CategoriesClient from './_components/client';

export default async function page({params}) {

  const categories = await prisma.category.findMany({
    where: {
        storeId: params.storeId,
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  const formattedcategories = categories.map((item)=>({
    id:               item.id,
    name:             item.name,
    billboardLabel:   item.billboard.label,
    createdAt:        format(item.createdAt, "MMMM do, yyyy")
  }))

  return (
    <div>
        <CategoriesClient
         data={formattedcategories}
        />
    </div>
    
  )
}
