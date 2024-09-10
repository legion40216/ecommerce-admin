"use client"

import CellActions from "@/components/table/cell-actions"
import CellLinks from "@/components/table/cell-links"


export const columns =  [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => 
      <CellLinks 
      dataId    = {row.original.id} 
      dataLabel = {row.getValue("name")} 
      paramsName = {'products'}
      /> 
  },

  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  
  {
    id: "actions",
    cell: ({ row }) => <CellActions
    dataId={row.original.id}
    paramsName="products"
    toastName="product"
    copyBoolean={true} 
    />,
  },
]
