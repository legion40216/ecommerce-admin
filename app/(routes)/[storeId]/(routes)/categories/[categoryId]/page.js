import React from 'react'
import prisma from '@/lib/prismadb';
import CategoryForm from './_components/catergory-form';

export default async function page({params}) {
  
    const category = await prisma.category.findUnique({
      where: {
          id: params.categoryId,
      }
  })

  const billboards = await prisma.billboard.findMany({
    where: {
        storeId: params.storeId,
    }
})

  return (
    <div>
      <CategoryForm 
      billboards={billboards} 
      initialData = {category}
      />
    </div>
  )
}
