"use client"
import React from 'react'
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation"

export default function CellLink(billboardId, value) {
    const params = useParams()
  return (
    <Button className="font-semibold" variant="link" asChild>
    <Link href={`/${params.storeId}/billboards/${billboardId}`}>
      {value}
    </Link>
  </Button>
  )
}
