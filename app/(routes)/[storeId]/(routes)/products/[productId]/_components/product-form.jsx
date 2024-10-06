"use client"
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"
import { z } from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';

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
import { Checkbox } from '@/components/ui/checkbox';

import { countries } from '@/lib/countries';
import Headings from '@/components/custom-ui/headings';
import ConfirmModal from '@/components/modals/confirm-modal';
import { Trash } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ImageUpload from '@/components/custom-ui/image-upload';


const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  images: z.array(z.object({ url: z.string().url("Invalid URL") })).min(1, "At least one image is required"),
  price: z.coerce.number().min(1, "Price must be greater than 0"),
  quantity: z.coerce.number(),
  categoryId: z.string().min(1, "Category is required"),
  colorId: z.string().min(1, "Color is required"),
  sizeId: z.string().min(1, "Size is required"),
  location: z.string().min(1, "Location is required"),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),

  weight: z.coerce.number().min(0.01, "Weight must be greater than 0"),
  shapeId: z.string().min(1, "Shape is required"),
  clarityId: z.string().transform(val => (val === 'none' ? null : val)).nullable(),
  cutId: z.string().transform(val => (val === 'none' ? null : val)).nullable(),
  lusterId: z.string().transform(val => (val === 'none' ? null : val)).nullable(),
  zodiacId: z.string().optional().nullable(),

  length: z.coerce.number().min(0).optional(),
  width: z.coerce.number().min(0).optional(),
  depth: z.coerce.number().min(0).optional(),
  treatment: z.string().optional(),
  certification: z.string().optional(),
  origin: z.string().optional(),
  rarityFactor: z.string().optional(),
  inclusions: z.string().optional(),
  fluorescence: z.string().optional(),

});

export default function ProductForm({
  categories,
  sizes,
  colors,
  shapes,     
  clarities,  
  cuts,       
  lusters,    
  zodiac,
  initialData,
}) {

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          quantity: initialData?.quantity || 0,
          weight: initialData?.weight || 0,
          length: initialData?.length || 0,
          width: initialData?.width || 0,
          depth: initialData?.depth || 0,
          zodiacId: initialData?.zodiacId || 'none', // Set 'none' if zodiac is null
          clarityId: initialData?.clarityId || 'none',
          cutId: initialData?.cutId || 'none',
          lusterId: initialData?.lusterId || 'none',
        }
      : {
          name: '',
          images: [],
          price: 0,
          quantity: 0,
          categoryId: '',
          colorId: '',
          sizeId: '',
          location: '',
          isFeatured: false,
          isArchived: false,  

          weight: 0,
          clarityId: 'none',
          cutId: 'none',
          lusterId: 'none',
          length: 0,
          width: 0,
          depth: 0,
          treatment: '',
          certification: '',
          origin: '',
          rarityFactor: '',
          inclusions: '',
          fluorescence: '',
          zodiacId: 'none', 
        }
  });

  const title         = initialData   ? "Edit Product"      : "Create Product"
  const desc          = initialData   ? "Edit the existing product details"      : "Add a new product to your store"
  const toastMessage  = initialData   ? "Product updated successfully!"   : "Product created successfully!"
  const toastLoading  = initialData   ? "Updating product..."  : "Creating product..."
  const action        = initialData   ? "Save Changes"      : "Create Product"

  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const {isSubmitting} = form.formState

  const onSubmit = async (values) => {
    const toastId = toast.loading(toastLoading); // Store the toastId
    const processedData = {
      ...values,
      clarityId: values.clarityId === 'none' ? null : values.clarityId,
      cutId: values.cutId === 'none' ? null : values.cutId,
      lusterId: values.lusterId === 'none' ? null : values.lusterId,
      zodiacId: values.zodiacId === 'none' ? null : values.zodiacId, // Process Zodiac Field
      // Process other fields if necessary
    };
    try {
        if(initialData) {
          await axios.patch(`/api/${params.storeId}/products/${params.productId}`, processedData);
        } else {
          await axios.post(`/api/${params.storeId}/products`, processedData);
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
  const toastId = toast.loading("Deleting product..."); // Store the toastId
  try {
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      toast.success("Product deleted successfully.");
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

    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Images Field */}
          <div>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((img) => img.url)}
                      disabled={isSubmitting || field.value.length >= 3}
                      onChange={(url) => {
                        const currentImages = form.getValues("images");
                        const newImage = { url: url };

                        if (currentImages.length < 3) {
                          const updatedImages = [...currentImages, newImage];
                          form.setValue("images", updatedImages, { shouldValidate: true });
                        } else {
                          toast.error("You can only upload a maximum of 3 images.");
                        }
                      }}
                      onRemove={(url) => {
                        const updatedImages = field.value.filter((current) => current.url !== url);
                        form.setValue("images", updatedImages, { shouldValidate: true });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Required Fields Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Name Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Product name" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Price Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" placeholder="Product price" disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quantity Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Product quantity"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Location Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Category Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Size Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="sizeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sizes.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Color Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="colorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a color" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colors.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Weight Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (carats)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="Gemstone weight"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Shape Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="shapeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shape</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a shape" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {shapes.map((shape) => (
                            <SelectItem key={shape.id} value={shape.id}>
                              {shape.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Optional Fields Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Clarity Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="clarityId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Clarity</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select clarity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem> {/* Represents null */}
                          {clarities.map((clarity) => (
                            <SelectItem key={clarity.id} value={clarity.id}>
                              {clarity.grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Cut Field (Optional) */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="cutId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cut</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a cut" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem> {/* Represents null */}
                          {cuts.map((cut) => (
                            <SelectItem key={cut.id} value={cut.id}>
                              {cut.grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Luster Field (Optional) */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="lusterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luster</FormLabel>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a luster" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem> {/* Represents null */}
                          {lusters.map((luster) => (
                            <SelectItem key={luster.id} value={luster.id}>
                              {luster.type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Length Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Length (mm)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="Length"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Width Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Width (mm)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="Width"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Depth Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Depth (mm)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="Depth"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Treatment Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Treatment details"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Certification Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="certification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Certification details"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Origin Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Origin details"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Rarity Factor Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="rarityFactor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rarity Factor</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Rarity factor details"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Inclusions Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="inclusions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inclusions</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Inclusions details"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fluorescence Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="fluorescence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fluorescence</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Fluorescence details"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Zodiac Field */}
              <div className="max-w-[400px]">
                <FormField
                  control={form.control}
                  name="zodiacId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zodiac Sign</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isSubmitting}
                          onValueChange={(value) => field.onChange(value === 'none' ? null : value)} // Handle "None" as null
                          value={field.value || 'none'} // Set default to 'none' if null
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select zodiac sign" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem> {/* Represents null */}
                            {zodiac.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Featured Checkbox */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div>
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the homepage
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Archived Checkbox */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3">
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div>
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will be archived and not appear on the homepage
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
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
