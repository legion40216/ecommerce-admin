"use client"
import React from 'react'
import { useState } from 'react';

import {toast} from 'sonner'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { Plus } from 'lucide-react'

import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import StoreForm from '../../_components/store-form';

export default function DashboardClient({

}) {
    const router = useRouter()
    const [close, setClose] = useState(false)
    
    const onSubmit = async (values) => {
        const toastId = toast.loading("Creating store"); // Store the toastId
        try {
            await axios.post(`/api/stores/`, values);
            toast.dismiss(toastId); // Dismiss the loading toast
            toast.success("Store created");
            router.refresh()
            setClose(false)
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

    const body = (
        <StoreForm
        onSubmit = {onSubmit}
        onClose = {setClose}
        />
      )
      
  return (
    <Modal
    body={body} 
    title={"Create store"}
    description={"Add a new store to manage products and categories"}
    close={close}
    setClose={setClose}
    >
        <Button>
        <Plus className='h-4 w-4 mr-1'/>
         Create stores
        </Button>
    </Modal>
  )
}
