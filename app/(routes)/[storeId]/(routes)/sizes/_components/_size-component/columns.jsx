"use client"
import { Button } from '@/components/ui/button';
import Link from "next/link";
import CellActions from "./cell-actions";

export const columns = (params) => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const sizeId = row.original.id 
      return (
      <Button
      className=" font-semibold"
      variant="link"
      asChild
      >
      <Link href={`/${params.storeId}/sizes/${sizeId}`}>
           {row.getValue("name")}
      </Link>
      </Button> 
      )
    },
  },

  {
    accessorKey: "value",
    header: "Value",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellActions sizeId={row.original.id} />,
  },
]
