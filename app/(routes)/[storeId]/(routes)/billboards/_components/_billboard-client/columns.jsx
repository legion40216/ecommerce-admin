"use client";
import CellActions from "@/components/table/cell-actions";
import CellLinks from "@/components/table/cell-links";


export const columns = [
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => 
    <CellLinks 
    dataId    = {row.original.id} 
    dataLabel = {row.getValue("label")} 
    paramsName = {'billboards'}
    />
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions
     dataId={row.original.id}
     paramsName="billboards"
     toastName="billboard"
     copyBoolean={true} 
     />,
  },
];