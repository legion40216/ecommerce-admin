"use client"

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import Headings from "@/components/custom-ui/headings";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import ConfirmModal from "@/components/modals/confirm-modal";
import { useOrigin } from "@/hooks/use-orgin";

const categorySchema = z.object({
  name: z.string().min(1,{
  message: "Required"
  }),
  billboardId: z.string().min(1, { message: "Image is required" })
})

export default function CategoryForm({
  initialData,
  billboards
}) {

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues:{
      name:         initialData?.name || "",
      billboardId:  initialData?.billboardId || ""
    }
  })  

  const title         = initialData   ? "Edit catergory"      : "Create catergory"
  const desc          = initialData   ? "Edit catergory"      : "Add new catergory"
  const toastMessage  = initialData   ? "catergory updated"   : "catergory created"
  const toastLoading  = initialData   ? "Updating catergory"  : "Creating updated"
  const action        = initialData   ? "Save changes"        : "Create catergory"

  const orgin = useOrigin()
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { isSubmitting } = form.formState;

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    try {
        if(initialData) {
          await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/categories`, values);
        }
        toast.success(toastMessage);
        toast.dismiss(toastId); // Dismiss the loading toast
        router.push(`/${params.storeId}/categories`)
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
  const toastId = toast.loading("Deleting categories"); // Store the toastId
  try {
      await axios.delete(`/api/${params.storeId}/categories/${params.category}`);
      toast.dismiss(toastId); // Dismiss the loading toast
      toast.success("Categories deleted.");
      router.push(`/${params.storeId}/categories`);
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
          className='space-y-3'
          >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
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
                      placeholder="Category name"
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
                name = "billboardId"
                render = {({field}) => 
                <FormItem>
                    <FormLabel>Billboard</FormLabel>
                      <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      values={field.value}
                      value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                            defaultValues={field.value} 
                            placeholder="Select a billboard" 
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            billboards.map((item)=>(
                              <SelectItem 
                              key={item.id}
                              value={item.id}
                              >
                                {item.label}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
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
