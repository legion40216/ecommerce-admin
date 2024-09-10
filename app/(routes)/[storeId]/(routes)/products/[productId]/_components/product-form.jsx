"use client"
import {useState} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import { toast } from 'sonner';
import axios from 'axios';

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import Headings from '@/components/custom-ui/headings';
import { Separator } from '@/components/ui/separator';
import { Trash } from 'lucide-react';
import ImageUpload from '@/components/custom-ui/image-upload';
import ConfirmModal from '@/components/modals/confirm-modal';
import { Checkbox } from '@/components/ui/checkbox';

const productSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export default function ProductForm({
  categories,
  sizes,
  colors,
  initialData,
}) {
    
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
    ? {
        ...initialData,
        price: parseFloat(String(initialData?.price)) // Convert Decimal to number
      }
    : {
        name: '',
        images: [],
        price: 0,
        categoryId: '',
        colorId: '',
        sizeId: '',
        isFeatured: false,
        isArchived: false,
      }
  });

  const title         = initialData   ? "Edit product"      : "Create product"
  const desc          = initialData   ? "Edit product"      : "Add new product"
  const toastMessage  = initialData   ? "Product updated"   : "Product created"
  const toastLoading  = initialData   ? "Updating product"  : "Creating product"
  const action        = initialData   ? "Save changes"      : "Create product"

  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const {isSubmitting} = form.formState

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    try {
        if(initialData) {
          await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/products`, values);
        }
        toast.success(toastMessage);
        router.push(`/${params.storeId}/products`)
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
  const toastId = toast.loading("Deleting product"); // Store the toastId
  try {
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      toast.success("product deleted.");
      router.push(`/${params.storeId}/products`);
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
          <form onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-5"
          >
            <div>
            <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((img) => img.url)} // Map over the array of images
                    disabled={isSubmitting || field.value.length >= 3} // Disable if max images reached
                    onChange={(url) => {
                      const currentImages = form.getValues("images");
                      const newImage = { url: url };

                      if (currentImages.length < 3) { // Prevent adding more than 3 images
                        const updatedImages = [...currentImages, newImage];
                        form.setValue("images", updatedImages, { shouldValidate: true });
                      } else {
                        toast.error("You can only upload a maximum of 3 images.");
                      }
                    }}
                    onRemove={(url) => {
                      const updatedImages = field.value.filter((current) => current.url !== url);
          
                      // Update form value and ensure revalidation
                      form.setValue("images", updatedImages, { shouldValidate: true })
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          </div>
            <div className="grid grid-cols-2 gap-4">
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
                      placeholder="Product name"
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
              name = "price"
              render = {({field}) => 
              <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                  <Input
                      {...field}
                      placeholder="Product price"
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
                name = "categoryId"
                render = {({field}) => 
                <FormItem>
                    <FormLabel>Categories</FormLabel>
                      <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      values={field.value}
                      value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                            placeholder="Select a categories" 
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            categories.map((item)=>(
                              <SelectItem 
                              key={item.id}
                              value={item.id}
                              >
                                {item.name}
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

              <div className=" max-w-[400px]">
                <FormField
                control = {form.control}
                name = "sizeId"
                render = {({field}) => 
                <FormItem>
                    <FormLabel>Size</FormLabel>
                      <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      values  = {field.value}
                      value   = {field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                            placeholder="Select a size" 
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            sizes.map((item)=>(
                              <SelectItem 
                              key={item.id}
                              value={item.id}
                              >
                                {item.name}
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

              <div className=" max-w-[400px]">
                <FormField
                control = {form.control}
                name = "colorId"
                render = {({field}) => 
                <FormItem>
                    <FormLabel>Color</FormLabel>
                      <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      values={field.value}
                      value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                            placeholder="Select a color" 
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            colors.map((item)=>(
                              <SelectItem 
                              key={item.id}
                              value={item.id}
                              >
                                {item.name}
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

                <div>
                <FormField
              control = {form.control}
              name = "isFeatured"
              render = {({field}) => 
              <FormItem 
              className="flex flex-row item-start space-x-3 
              space-y-0 rounded-md border-4 p-4"
              >
                <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                </FormControl>
                <div>
                  <FormLabel>
                    Featured
                  </FormLabel>
                  <FormDescription>
                    This product will appear on the homepage
                  </FormDescription> 
                  </div>
                <FormMessage/>
              </FormItem>
              }
              />
                </div>
    
              <div>
              <FormField
              control = {form.control}
              name = "isArchived"
              render = {({field}) => 
              <FormItem 
              className="flex flex-row item-start space-x-3 
              space-y-0 rounded-md border-4 p-4"
              >
             <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            
              <div>
                <FormLabel>
                  Archived
                </FormLabel>
                <FormDescription>
                  This product will appear on the homepage
                </FormDescription> 
                  </div>
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