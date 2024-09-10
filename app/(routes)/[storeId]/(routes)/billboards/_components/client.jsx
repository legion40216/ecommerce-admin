"use client"
import React from 'react'

import { Button } from '@/components/ui/button'
import Headings from '@/components/custom-ui/headings'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'

import { columns } from './_billboard-client/columns'
import { DataTable } from '@/components/table/data-table'
import ApiList from '@/components/custom-ui/api-list'

export default function BillboardClient({
  data
}) {

  return (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
              <Headings
              title={`Billboards (${data.length})`}
              discription={"Manage billboards of your store"}
              />
              <Button onClick = {()=>{router.push(`billboards/new`)}}>
                  <Plus className='h-4 w-4 mr-1'/>
                      Add new
              </Button>
          </div>

        <Separator />

          <DataTable
          searchKey={"label"} 
          columns={columns} 
          data={data}
          />

        <Headings
        title={`API`}
        discription={"API call for billboards"}
        />

        <Separator />

        <ApiList 
        entryIdName={'billboardId'}
        entryName={'billboards'}
        />
    </div>
  )
}
