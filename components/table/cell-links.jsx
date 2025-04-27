"use client"
import React from 'react'

import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';

export default function CellLinks({
    dataId,
    dataLabel,
    paramsName
}) {
    const params = useParams()
    const router = useRouter();
    
  return (
    <Button 
        className="font-semibold" 
        variant="link" 
        onClick={() => {
            router.push(`/${params.storeId}/${paramsName}/${dataId}`);
          }}
        >
         {dataLabel}
    </Button>
  )
}
