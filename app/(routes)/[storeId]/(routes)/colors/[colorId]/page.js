import React from 'react'
import prisma from '@/lib/prismadb';
import ColorForm from './_components/color-form';

export default async function page({params}) {
  
    const color = await prisma.color.findUnique({
        where: {
            id: params.colorId,
        }
    })

  return (
    <div>
      <ColorForm
      initialData={color}
      />
    </div>
  )
}
