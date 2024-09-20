import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import axios from 'axios';
import { useParams } from 'next/navigation';

export const PaymentToggle = ({ orderId, initialStatus, paymentMethod }) => {
  const [isPaid, setIsPaid] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const onToggle = async (checked) => {
    if (paymentMethod !== 'cod') {
      toast.error("Only COD orders can be manually toggled.");
      return;
    }

    setIsLoading(true);
    try {
        await axios.patch(`/api/${params.storeId}/orders/${orderId}`, {
        isPaid: checked
      });
      
      setIsPaid(checked);
      toast.success("Payment status updated successfully");
    } catch (error) {
      toast.error(error.response?.data || "Failed to update payment status");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch
      checked={isPaid}
      onCheckedChange={onToggle}
      disabled={isLoading || paymentMethod !== 'cod'}
    />
  );
};