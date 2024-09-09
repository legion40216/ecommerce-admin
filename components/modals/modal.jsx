import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
export default function Modal({
    body,
    children,
    description,
    title,
    close,
    setClose,
    width
}) {

  return (
    <Dialog open={close} onOpenChange={setClose}>
    <DialogTrigger className={`${width}`} asChild>{children}</DialogTrigger>
    <DialogContent>
        <DialogHeader>
        <DialogTitle><span className="text-primary">{title}</span></DialogTitle>
        <DialogDescription>
            {description}
        </DialogDescription>
        </DialogHeader>
        <div>{body}</div>
    </DialogContent>
    </Dialog>
  )
}
