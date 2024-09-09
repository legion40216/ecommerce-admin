"use client"
import { Button } from '@/components/ui/button';
import { useParams } from "next/navigation"
i
import Link from "next/link";
import CellActions from "./cell-actions";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const params = useParams()
      const sizeId = row.original.id 
      return (
      <Button
      className=" font-semibold"
      variant="link"
      asChild
      >
      <Link href={`/${params.storeId}/billboards/${sizeId}`}>
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
