"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import { Trash } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Headings from "@/components/custom-ui/headings";
import { Separator } from "@/components/ui/separator";
import ConfirmModal from "@/components/modals/confirm-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { claritySchema } from "@/lib/validators";

export default function ClarityForm({ initialData }) {
  const form = useForm({
    resolver: zodResolver(claritySchema),
    defaultValues: {
      grade: initialData?.grade || "",
    },
  });

  const title = initialData 
  ? "Edit clarity grade" 
  : "Create clarity grade";
const desc = initialData
  ? "Edit the clarity grade details"
  : "Add a new clarity grade";
const toastMessage = initialData
  ? "Clarity grade updated successfully!"
  : "Clarity grade updated successfully!";
const toastLoading = initialData
  ? "Updating clarity grade..."
  : "Creating clarity grade...";
const action = initialData 
  ? "Save Changes" 
  : "Create clarity grade";

  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading);
    try {
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/clarities/${params.clarityId}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/clarities`, values);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/clarities`);
      router.refresh();
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.error || "Something went wrong!");
    }  finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  const onDelete = async () => {
    const toastId = toast.loading("Deleting clarity grade");
    try {
      await axios.delete(`/api/${params.storeId}/clarities/${params.clarityId}`);
      toast.success("Clarity grade deleted.");
      router.push(`/${params.storeId}/clarities`);
      router.refresh();
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.error || "Something went wrong!");
    }  finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <Headings title={title} description={desc} />
        {initialData && (
          <ConfirmModal 
          onConfirm={onDelete} 
          open={open}
          setOpen={setOpen}>
            <Button
              disabled={isSubmitting}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </ConfirmModal>
        )}
      </div>

      <Separator />

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Clarity grade"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <Button type="submit" disabled={isSubmitting}>
                {action}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
