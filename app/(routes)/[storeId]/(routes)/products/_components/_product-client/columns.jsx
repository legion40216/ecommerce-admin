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
      const productId = row.original.id 
      return (
      <Button
      className=" font-semibold"
      variant="link"
      asChild
      >
      <Link href={`/${params.storeId}/products/${productId}`}>
           {row.getValue("name")}
      </Link>
      </Button> 
      )
    },
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
    cell: ({ row }) => <CellActions productId={row.original.id} />,
  },
]
