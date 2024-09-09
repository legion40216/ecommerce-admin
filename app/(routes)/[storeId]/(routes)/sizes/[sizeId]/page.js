import React from 'react'
import prisma from '@/lib/prismadb';
import SizeForm from './_components/size-form';


export default async function page({params}) {
  
    const size = await prisma.size.findUnique({
        where: {
            id: params.sizeId,
        }
    })

  return (
    <div>
      <SizeForm 
      initialData={size}
      />
    </div>
  )
}
