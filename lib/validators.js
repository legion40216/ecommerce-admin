import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
});

export const billboardSchema = z.object({
  label: z.string().min(1, { message: "Required" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
});

export const colorSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(4).regex(/^#/, {
    message: 'String must be valid hex code'
  })
})

export const categorySchema = z.object({
  name: z.string().min(1,{
  message: "Required"
  }),
  billboardId: z.string().min(1, { message: "Image is required" })
})

export const productSchema = z.object({
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
  fluorescence: z.string().optional()
});

export const shapeSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }),
});

export const cutSchema = z.object({
  grade: z.string().min(1, { message: "Required" }),
});

export const lusterSchema = z.object({
  type: z.string().min(1, { message: "Type is required" }),
});

export const claritySchema = z.object({
  grade: z.string().min(1, { message: "Required" }),
});