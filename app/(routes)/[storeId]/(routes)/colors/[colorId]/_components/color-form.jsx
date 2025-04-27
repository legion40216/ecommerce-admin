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
import { useOrigin } from "@/hooks/use-orgin";

const colorSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be valid hex code'
  })
})

export default function ColorForm({
  initialData,
}) {
  
  const form = useForm({
      resolver: zodResolver(colorSchema),
      defaultValues:{
        name:           initialData?.name || "",
        value:          initialData?.value || ""
      }
    })  
  

  const title         = initialData   ? "Edit color"      : "Create color"
  const desc          = initialData   ? "Edit color"      : "Add new color"
  const toastMessage  = initialData   ? "Color updated"   : "color created"
  const toastLoading  = initialData   ? "Updating color"  : "Creating color"
  const action        = initialData   ? "Save changes"    : "Create"

  const orgin = useOrigin()
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    try {
        if(initialData) {
          await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/colors`, values);
        }
        toast.success(toastMessage);
        toast.dismiss(toastId); // Dismiss the loading toast
        router.push(`/${params.storeId}/colors`)
        router.refresh();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data);
    } else {
        toast.error("Server Error: Unable to process the request");
    }
    } finally {
      toast.dismiss(toastId); // Dismiss loading toast in one place
    }
};

const onDelete = async () => {
  const toastId = toast.loading("Deleting colors"); // Store the toastId
  try {
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      toast.dismiss(toastId); // Dismiss the loading toast
      toast.success("colors deleted.");
      router.push(`/${params.storeId}/colors`);
      router.refresh()
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
          <form onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-10'
          >
          <div className="grid grid-cols-2 gap-3">
            <div className=" max-w-[400px]">
              <FormField
              control = {form.control}
              name = "name"
              render = {({field}) => 
              <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                  <Input
                      {...field}
                      placeholder="Color name"
                      disabled={isSubmitting}
                      />
                  </FormControl>
                  <FormMessage/>
              </FormItem>
              }
              />
            </div>

            <div className=" max-w-[400px]">
              <FormField
              control = {form.control}
              name = "value"
              render = {({field}) => 
              <FormItem>
                  <FormLabel>value</FormLabel>
                  <FormControl>
                    <div className="flex gap-3">
                      <Input
                        {...field}
                        placeholder="Color value"
                        disabled={isSubmitting}
                      />
                      <div 
                      style = {{backgroundColor: field.value}}
                      className = "border p-4 rounded-full"
                      />
                    </div>
            
                  </FormControl>
                  <FormMessage/>
              </FormItem>
              }
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