"use client"
import { Button } from '@/components/ui/button';
import Link from "next/link";
import CellActions from './cell-actions';

export const columns = (params) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {

      const colorId = row.original.id 
      return (
      <Button
      className=" font-semibold"
      variant="link"
      asChild
      >
      <Link href={`/${params.storeId}/colors/${colorId}`}>
           {row.getValue("name")}
      </Link>
      </Button> 
      )
    },
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
    cell: ({ row }) => <CellActions colorId={row.original.id} />,
  },
]
