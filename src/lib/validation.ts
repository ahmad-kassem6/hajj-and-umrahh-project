import * as z from 'zod'

const hotelSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Hotel name is required'),
  city_id: z.number(),
  city_name: z.string(),
  number_of_nights: z.number().min(1, 'Number of nights must be at least 1'),
  description: z.string().min(1, 'Description is required'),
})

export const tripSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(255, 'Name must be less than 255 characters'),
    price: z.number().min(0.01, 'Price must be greater than 0'),
    image: z.instanceof(File).optional(),
    start_date: z.string(),
    end_date: z.string(),
    is_active: z.number(),
    hotels: z.array(hotelSchema),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: 'End date must be after start date',
    path: ['end_date'],
  })

export type TripFormData = z.infer<typeof tripSchema>
