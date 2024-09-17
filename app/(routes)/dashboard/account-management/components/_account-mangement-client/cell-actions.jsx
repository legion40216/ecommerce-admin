"use client"
import { useState } from "react";
import ConfirmModal from "@/components/modals/confirm-modal";
import { 
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
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CellActions({ 
  dataId,
}) {
 
  const [open, setOpen] = useState(false);
  const router = useRouter()

  const handleDeleteUser = async () => {
    const toastId = toast.loading(`Deleting user`);
    try {
      await axios.post('/api/clerkActions/deleteUser', { userId: dataId  });
      toast.success("User deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete user:', error);
      console.error(error.response?.data?.error || "Failed to delete user");
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
      setOpen(false);
    }
};

  return (
    <>
    <ConfirmModal onConfirm={handleDeleteUser} open={open} setOpen={setOpen} />
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