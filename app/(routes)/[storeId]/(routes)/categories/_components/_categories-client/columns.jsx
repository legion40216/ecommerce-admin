"use client"
import { Button } from '@/components/ui/button';
import { useParams } from "next/navigation"
import Link from "next/link";
import CellActions from "./cell-actions";

export const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const params = useParams()
      const categoryId = row.original.id 
      return (
      <Button
      className=" font-semibold"
      variant="link"
      asChild
      >
      <Link href={`/${params.storeId}/categories/${categoryId}`}>
           {row.getValue("name")}
      </Link>
      </Button> 
      )
    },
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
    cell: ({ row }) => <CellActions categoryId={row.original.id} />,
  },
]
