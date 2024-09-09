"use client"
import { Button } from '@/components/ui/button'
import Headings from '@/components/custom-ui/headings'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'

import { useRouter } from 'next/navigation';
import React from 'react'

import { columns } from './_categories-client/columns'
import { DataTable } from '@/components/table/data-table'
import ApiList from '@/components/custom-ui/api-list'

export default function CategoriesClient({
  data
}) {
  const router = useRouter()

  return (
<div className="space-y-3">
<div className="flex justify-between items-center">
<Headings
  title={`Categories (${data.length})`}
  discription={"Manage categories of your store"}
  />
  <Button onClick = {()=>{router.push(`categories/new`)}}>
      <Plus className='h-4 w-4 mr-1'/>
          Add new
  </Button>
  </div>

<Separator />

  <DataTable
    searchKey={"name"}
    columns={columns} 
    data={data}
  />

<Headings
title={`API`}
discription={"API call for categories"}
/>

<Separator />

<ApiList 
entryIdName={'categories'}
entryName={'categories'}
/>
</div>
  )
}
