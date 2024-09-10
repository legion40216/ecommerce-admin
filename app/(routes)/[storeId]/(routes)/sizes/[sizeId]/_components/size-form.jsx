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

const sizeSchema = z.object({
  name: z.string().min(1,{
   message: "Required"
  }),
  value: z.string().min(1,{
    message: "Required"
  }),
})

export default function SizeForm({
  initialData,
}) {
  
  const form = useForm({
    resolver: zodResolver(sizeSchema),
    defaultValues:{
      name:   initialData?.name  || "",
      value:  initialData?.value || ""
    }
  })  

  const title         = initialData   ? "Edit size"      : "Create size"
  const desc          = initialData   ? "Edit size"      : "Add new size"
  const toastMessage  = initialData   ? "Size updated"   : "Size created"
  const toastLoading  = initialData   ? "Updating size"  : "Creating size"
  const action        = initialData   ? "Save changes"   : "Create"

  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const {isSubmitting} = form.formState

  const onSubmit = async (values) => {
      const toastId = toast.loading(toastLoading); // Store the toastId
      try {
          if(initialData) {
            await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values);
          } else {
            await axios.post(`/api/${params.storeId}/sizes`, values);
          }
          toast.success(toastMessage);
          router.push(`/${params.storeId}/sizes`)
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
    const toastId = toast.loading("Deleting sizes"); // Store the toastId
    try {
        await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
        toast.success("sizes deleted.");
        router.push(`/${params.storeId}/sizes`);
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                      placeholder="Size name"
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
                  <Input
                      {...field}
                      placeholder="Size value"
                      disabled={isSubmitting}
                      />
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