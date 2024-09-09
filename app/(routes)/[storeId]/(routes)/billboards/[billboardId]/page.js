import React from 'react'
import prisma from '@/lib/prismadb';
import BillboardForm from './_components/billboard-form';


export default async function page({params}) {
  
    const billboard = await prisma.billboard.findUnique({
      where: {
          id: params.billboardId,
      }
  })
  
  return (
    <div>
      <BillboardForm  
      initialData = {billboard}
      />
    </div>
  )
}
