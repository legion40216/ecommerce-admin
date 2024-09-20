"use client"
import { PaymentToggle } from "./payment-toggle"
import CellActions from './cell-actions';
import CellLink from "./cell-link";

export const columns = [
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => (
      <CellLink
      products={row.original.products} 
      paramsName="products" 
      />
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <PaymentToggle
        orderId={row.original.id}
        initialStatus={row.original.isPaid}
        paymentMethod={row.original.paymentMethod}
      />
    )
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <CellActions
        dataId={row.original.id}
        paramsName="orders"
        toastName="order"
        copyBoolean={true}
      />
    ),
  },
]
