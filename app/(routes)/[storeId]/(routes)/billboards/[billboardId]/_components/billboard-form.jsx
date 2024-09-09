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
import ImageUpload from "@/components/custom-ui/image-upload";
import { useOrigin } from "@/hooks/use-orgin";
import { ApiAlert } from "@/components/custom-ui/api-alert";

const billboardSchema = z.object({
  label: z.string().min(1, { message: "Required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

export default function BillboardForm({ initialData }) {
  const form = useForm({
    resolver: zodResolver(billboardSchema),
    defaultValues: {
      label: initialData?.label || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const title = initialData ? "Edit billboard" : "Create billboard";
  const desc = initialData ? "Edit billboard" : "Add new billboard";
  const toastMessage = initialData
    ? "Billboard updated"
    : "Billboard created";
  const toastLoading = initialData
    ? "Updating billboard"
    : "Creating billboard";
  const action = initialData
    ? "Save changes"
    : "Create billboard";

  const orgin = useOrigin()
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading);
    try {
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values);
      }
      toast.success(toastMessage);
      router.push(`/${params.storeId}/billboards`);
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
    const toastId = toast.loading("Deleting billboard");
    try {
      await axios.delete(`/api/${params.storeId}/billboards/${params.category}`);
      toast.success("Billboard deleted.");
      router.push(`/${params.storeId}/billboards`);
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
      <div className="flex justify-between items-center">
        <Headings title={title} description={desc} />
        {initialData && (
          <ConfirmModal
            onConfirm={onDelete}
            open={open}
            setOpen={setOpen}
          >
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Background image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ? [field.value] : []}
                        disabled={isSubmitting}
                        onChange={(url) => field.onChange(url)}
                        onRemove={() => field.onChange("")}
                        limitValue={1}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Billboard label"
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
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {action}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}