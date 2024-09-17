"use client"
import CellActions from "@/components/table/cell-actions"
import CellLinks from "@/components/table/cell-links"

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => 
      <CellLinks 
      dataId    = {row.original.id} 
      dataLabel = {row.getValue("name")} 
      paramsName = {'colors'}
      /> 
  },

  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    )
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellActions
    dataId={row.original.id}
    paramsName="colors"
    toastName="color"
    copyBoolean={true} 
    />,
  },
]
