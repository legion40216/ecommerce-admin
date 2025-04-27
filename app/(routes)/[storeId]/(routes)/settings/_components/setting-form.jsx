"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import {useState} from 'react'
import { toast } from 'sonner';
import axios from 'axios';

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"

import { Button } from '@/components/ui/button'
import Headings from '@/components/custom-ui/headings'
import { Separator } from '@/components/ui/separator'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useParams, useRouter } from 'next/navigation';
import ConfirmModal from '@/components/modals/confirm-modal';
import { ApiAlert } from '@/components/custom-ui/api-alert';
import { useOrigin } from '@/hooks/use-orgin';
import { storeSchema } from '@/app/(routes)/_components/store-form';

export default function SettingForm({
  store
}) {

  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues:{
      name:  store.name,
    }
  })  

  const orgin = useOrigin()
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const {isSubmitting} = form.formState

  const onSubmit = async (values) => {
    const toastId = toast.loading("Updating store"); // Store the toastId
    try {
        await axios.patch(`/api/stores/${params.storeId}`, values);
        toast.dismiss(toastId); // Dismiss the loading toast
        toast.success("Store has been updated");
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
  const toastId = toast.loading("Deleting store"); // Store the toastId
  try {
      await axios.delete(`/api/stores/${params.storeId}`);
      toast.dismiss(toastId); // Dismiss the loading toast
      toast.success("Store has been deleted");
      router.push("/");
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
        <div className = "flex justify-between items-center">
          <Headings
          title={"Settings"}
          discription={"Manage store preferences"}
          />

        <ConfirmModal 
          onConfirm={onDelete}
          open={open} 
          setOpen={setOpen}
          >
            <Button
            disabled={isSubmitting}
            variant="destructive"
            size="sm"
            onClick={()=>{setOpen(true)}}
            >
              <Trash className="h-4 w-4"/>
            </Button>
          </ConfirmModal>
        </div>

        <Separator />

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-3'
            >
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
                        placeholder="E-commerce"
                        disabled={isSubmitting}
                      />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
                }
                />
              </div>
              <div> 
              <Button 
              type="submit"
              disabled={isSubmitting}
              >
                Update
              </Button>
              </div>
            </form>
          </Form>
        </div>
        <Separator />
        <ApiAlert 
        title={"NEXT_PUBLIC_API_URL"}
        description={`${orgin}/api/${params.storeId}`}
        variant='public'
        />
    </div>
  )
}
