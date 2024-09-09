"use client"
import React from 'react'

import Headings from '@/components/custom-ui/headings'
import { Separator } from '@/components/ui/separator'


import { DataTable } from '@/components/table/data-table'
import { columns } from './_order-client/columns'

export default function OrderClient({
  data
}) {


  return (
    <div className="space-y-5">
      <div>
          <Headings
          title={`Orders (${data.length})`}
          discription={"Manage orders of your store"}
          />
      </div>
      
        <div className="space-y-3">
          <DataTable
          searchKey={"product"} 
          columns={columns} 
          data={data}
          />
        </div>
 
    </div>
  )
}
