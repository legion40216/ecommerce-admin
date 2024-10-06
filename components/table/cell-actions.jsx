"use client"
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import ConfirmModal from "@/components/modals/confirm-modal";
import { 
    Copy,
    Edit, 
    MoreHorizontal, 
    Trash2 
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function CellActions({ 
  dataId,
  paramsName,
  toastName,
  copyBoolean 
}) {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);

  const onCopy = (id) => {
    navigator.clipboard.writeText(id);
    toast.success("Id copied to the clipboard.");
  };

  const onDelete = async () => {
    const toastId = toast.loading(`Deleting ${toastName}`);
    try {
      await axios.delete(`/api/${params.storeId}/${paramsName}/${dataId}`);
      toast.success(`${toastName.toUpperCase()} deleted`);
      router.refresh();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Server Error: Unable to process the request");
      }
    } finally {
      toast.dismiss(toastId); 
      setOpen(false);
    }
  };
  
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
        <DropdownMenuSeparator />
        {copyBoolean &&
        <DropdownMenuItem
          onClick={() => {
            onCopy(dataId)
          }}
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Id
        </DropdownMenuItem>
        }
        <DropdownMenuItem
          onClick={() => {
            router.push(`/${params.storeId}/${paramsName}/${dataId}`);
          }}
        >
          <Edit className="h-4 w-4 mr-2" />
          Update
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setOpen(true);
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </>
  )
}
