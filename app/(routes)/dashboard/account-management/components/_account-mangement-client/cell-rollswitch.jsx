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
      const response = await axios.post('/api/clerkActions/updateUserRole', { userId: dataId, newRole });
      toast.success("Role updated successfully");
      router.refresh();
    } catch (error) {
      toast.error('Failed to update role:', error.message);
      console.error(error.response?.data?.error || "Failed to update role");
    } finally {
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