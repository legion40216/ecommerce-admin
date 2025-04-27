import { useOrigin } from '@/hooks/use-orgin';
import { useParams } from 'next/navigation';
import React from 'react'
import { ApiAlert } from './api-alert';

export default function ApiList({
    entryName,
    entryIdName
}) {
    const orgin = useOrigin()
    const params = useParams();

    const baseUrl = `${orgin}/api/${params.storeId}`
  return (
    <div className="space-y-3">
        <ApiAlert 
        title={'GET'}
        variant={'public'}
        description={`${baseUrl}/${entryName}`}
        />

        <ApiAlert 
        title={'GET'}
        variant={'public'}
        description={`${baseUrl}/${entryName}/[${entryIdName}]`}
        />
    </div>
  )
}
