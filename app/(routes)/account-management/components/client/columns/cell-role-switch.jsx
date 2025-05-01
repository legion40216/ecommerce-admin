"use client";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from "next/navigation";

export default function CellRoleSwitch({ 
  dataId, 
  currentRole,
}) {
  const [roleSwitching, setRoleSwitching] = useState(false);
  const router = useRouter()

  const handleRoleChange = async (checked) => {
    const newRole = checked ? 'user' : null;
    const toastId = toast.loading(`Updating role...`);
    setRoleSwitching(true);

    try {
      await axios.post('/api/clerkActions/updateUserRole', { userId: dataId, newRole });
      toast.success("Role updated successfully");
      router.refresh();
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.error || "Something went wrong!");
    }  finally {
      toast.dismiss(toastId);
      setRoleSwitching(false);
    } 
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={currentRole === 'admin' || currentRole === 'user'}
        onCheckedChange={(checked) => handleRoleChange(checked)}
        disabled={roleSwitching}
      />
    </div>
  );
}