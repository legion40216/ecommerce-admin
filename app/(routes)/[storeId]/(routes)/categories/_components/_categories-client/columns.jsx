"use client"

import CellActions from "@/components/table/cell-actions"
import CellLinks from "@/components/table/cell-links"


export const columns  = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => 
      <CellLinks 
      dataId    = {row.original.id} 
      dataLabel = {row.getValue("name")} 
      paramsName = {'categories'}
      /> 
  },

  {
    accessorKey: "billboardLabel",
    header: "Billboard label",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellActions
    dataId={row.original.id}
    paramsName="categories"
    toastName="category"
    copyBoolean={true} 
    />,
  },
]
