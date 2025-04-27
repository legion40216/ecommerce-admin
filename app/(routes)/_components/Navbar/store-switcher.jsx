"use client"
import React from 'react'
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation'

import { toast } from 'sonner';
import axios from 'axios';
import { cn } from '@/lib/utils';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { 
  Check, 
  ChevronsUpDown, 
  PlusCircle, 
  StoreIcon 
} from 'lucide-react';

import StoreForm from '../store-form';
import Modal from '@/components/modals/modal';
import { Button } from '@/components/ui/button';


export default function StoreSwitcher({stores}) {
    // const storeModal = useStoreModal()
    const params = useParams()
    const router = useRouter()

    const formattedItem = stores.map((store)=>({
      label: store.name,
      value: store.id
    }))

    const [open, setOpen] = useState(false)
    const [close, setClose] = useState(false)

    const currentStore = formattedItem.find((item) => item.value === params.storeId) 

    const onStoreSelect =(value) => {
      setOpen(false)
      router.push(`/${value}`)
    }

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
        onClose  = {setClose}
        />
      )
    
  return (
    <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="w-[200px] justify-between"
      >
        <StoreIcon className="mr-2 h-4 w-4"/>
        {currentStore ? (currentStore.label ? currentStore.label : "Not  found") : "Select store"}
        <ChevronsUpDown className="ml-auto w-4 h-4 shrink-0 opacity-50"/>
      </Button>
    </PopoverTrigger>
    <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Search store..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {formattedItem.map((store) => (
                  <CommandItem
                    key={store.value}
                    value={store.value}
                    onSelect={() => onStoreSelect(store.value)}
                  >
                     <StoreIcon className="mr-2 h-4 w-4"/>
                     {store.label}
                     <Check className={cn("ml-auto h-4 w-4",
                      currentStore?.value === store.value
                      ? "opacity-100"
                      : "opacity-0"
                     )}/>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator/>
            <CommandList>
              <CommandGroup>
              <Modal
                body={body} 
                title={"Create store"}
                description={"Add a new store to manage products and categories"}
                close={close}
                setClose={setClose}
                >
                <CommandItem onSelect={()=>{
                setClose(true)
                }}
                >
                  <PlusCircle className="mr-2 h- w-5"/>
                  Create store
                </CommandItem>
                </Modal>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
    </Popover>
  )
}
