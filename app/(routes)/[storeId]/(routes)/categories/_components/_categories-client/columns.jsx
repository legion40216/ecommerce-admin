"use client"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useState } from 'react'
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from "next/navigation"
import ConfirmModal from "@/components/modals/confirm-modal";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

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
    cell: ({ row }) => {
      const categoryId = row.original.id
      const router = useRouter()
      const params = useParams()
      const [open, setOpen] = useState(false)
  
      const onDelete = async () => {
        const toastId = toast.loading("Deleting category");
        try {
         await axios.delete(`/api/${params.storeId}/categories/${categoryId}`)
         toast.success("Category deleted")
         router.refresh()
         setOpen(false)
        } catch (error) {
          if (error.response && error.response.data) {
            toast.error(error.response.data);
        } else {
            toast.error("Server Error: Unable to process the request");
        }
        } finally {
          toast.dismiss(toastId); // Dismiss loading toast in one place
        }
      } 

      return (
        <>
        <ConfirmModal 
        onConfirm={onDelete} 
        open={open} 
        setOpen={setOpen}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick={()=>{router.push(`/${params.storeId}/categories/${categoryId}`)}}>
              <Edit className="h-4 w-4 mr-2"/>
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{setOpen(true)}}>
              <Trash2 className='h-4 w-4 mr-2'/> 
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </>
      )
    },
  },
]
