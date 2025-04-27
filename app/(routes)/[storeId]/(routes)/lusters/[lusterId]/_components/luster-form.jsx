"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import Headings from "@/components/custom-ui/headings";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import ConfirmModal from "@/components/modals/confirm-modal";

const lusterSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
});

export default function LusterForm({ initialData }) {
  const form = useForm({
    resolver: zodResolver(lusterSchema),
    defaultValues: {
      type: initialData?.type || "",
    },
  });

  const title = initialData ? "Edit Luster" : "Create Luster";
  const desc = initialData ? "Edit luster details" : "Add a new luster";
  const toastMessage = initialData ? "Luster updated" : "Luster created";
  const toastLoading = initialData ? "Updating luster" : "Creating luster";
  const action = initialData ? "Save changes" : "Create";

  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading);
    try {
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/lusters/${params.lusterId}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/lusters`, values);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/lusters`);
      router.refresh();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Server Error: Unable to process the request");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  const onDelete = async () => {
    const toastId = toast.loading("Deleting luster");
    try {
      await axios.delete(`/api/${params.storeId}/lusters/${params.lusterId}`);
      toast.success("Luster deleted.");
      router.push(`/${params.storeId}/lusters`);
      router.refresh();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error("Server Error: Unable to process the request");
      }
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <Headings title={title} description={desc} />
        {initialData && (
          <ConfirmModal onConfirm={onDelete} open={open} setOpen={setOpen}>
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

      {/* Form Section */}
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Luster type"
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
