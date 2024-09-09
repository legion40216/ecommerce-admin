import React from 'react'

export default function Headings({
    title,
    discription 
}) {
  return (
    <div>
        <h2 className=" text-3xl font-bold tracking-tigh">{title}</h2>
        <p className=" text-sm text-muted-foreground">{discription}</p>
    </div>
  )
}
