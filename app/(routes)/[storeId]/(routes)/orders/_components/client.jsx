"use client"
import React from 'react'
import Headings from '@/components/custom-ui/headings'
import { DataTable } from '@/components/table/data-table'
import { columns } from './_order-client/columns'

export default function OrderClient({ data }) {
  return (
    <div className="space-y-5">
      <div>
        <Headings
          title={`Orders (${data.length})`}
          description={"Manage orders of your store"}
        />
      </div>
      <div className="space-y-3">
        <DataTable
          searchKey="customerName"
          columns={columns}
          data={data}
        />
      </div>
    </div>
  )
}