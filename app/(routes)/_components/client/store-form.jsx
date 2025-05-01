"use client"
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"

import { Input } from "@/components/ui/input"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Button } from '@/components/ui/button'
import { storeSchema } from '@/lib/validators'

export default function StoreForm({
  onSubmit,
  onClose
}) {
    const form = useForm({
        resolver: zodResolver(storeSchema),
        defaultValues:{
          name:  "",
        }
      })  
    
      const {isSubmitting} = form.formState

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}
    className=' space-y-8'
    >
      <div>
        <FormField
        control = {form.control}
        name = "name"
        render = {({field}) => 
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
             <Input
                {...field}
                placeholder="E-commerce"
                disabled={isSubmitting }
              />
          </FormControl>
          <FormMessage/>
        </FormItem>
        }
        />
      </div>
      <div className='flex items-center gap-1 justify-end'> 
       <Button 
       type="button"
       variant="outline"
       onClick={()=>{onClose(false)}}
       >
          Cancel
       </Button>
       <Button 
       type="submit"
       disabled={ isSubmitting }
       >
        Create
       </Button>
      </div>
    </form>
  </Form>
  )
}
