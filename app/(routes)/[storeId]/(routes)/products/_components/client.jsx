"use client"
import { Button } from '@/components/ui/button'
import Headings from '@/components/custom-ui/headings'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'

import { useParams, useRouter } from 'next/navigation';
import React from 'react'

import { DataTable } from '@/components/table/data-table'

import ApiList from '@/components/custom-ui/api-list'
import { columns } from './_product-client/columns'


export default function ProductClient({
  data
}) {
  const router = useRouter()
  const params = useParams()

  return (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
             <Headings
              title={`Products (${data.length})`}
              discription={"Manage products of your store"}
              />
              <Button onClick = {()=>{router.push(`products/new`)}}>
                  <Plus className='h-4 w-4 mr-1'/>
                      Add new
              </Button>
          </div>

        <Separator />

          <DataTable
            searchKey={"name"}
            columns={columns(params)} 
            data={data}
          />

        <Headings
        title={`API`}
        discription={"API call for products"}
        />

        <Separator />

        <ApiList 
        entryIdName={'products'}
        entryName={'products'}
        />
    </div>
  )
}
