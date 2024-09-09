"use client"
import { Button } from '@/components/ui/button';
import Link from "next/link";

export const columns = (parmas) = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      const ProductId = row.original.id 
      return (
      <Button
      className=" font-semibold"
      variant="link"
      asChild
      >
      <Link href={`/${params.storeId}/products/${ProductId}`}>
           {row.getValue("product")}
      </Link>
      </Button> 
      )
    },
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
    accessorKey: "totalprice",
    header: "Totalprice",
  },
  
  {
    accessorKey: "isPaid",
    header: "paid",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const billboardId = row.original.id
  //     const router = useRouter()
  //     const params = useParams()
  //     const [open, setOpen] = useState(false)
  
  //     const onDelete = async () => {
  //       const toastId = toast.loading("Deleting billboard");
  //       try {
  //        await axios.delete(`/api/${params.storeId}/billboards/${billboardId}`)
  //        toast.dismiss(toastId); // Dismiss the loading toast
  //        toast.success("Billboard deleted")
  //        router.refresh()
  //        setOpen(false)
  //       } catch (error) {
  //         console.log(error)
  //        if (error.response && error.response.data) {
  //          toast.error(error.response.data);
  //        } else {
  //          toast.error("Server Error: Unable to process the request");
  //        }
  //      } 
  //     } 

  //     return (
  //       <>
  //       <ConfirmModal 
  //       onConfirm={onDelete} 
  //       open={open} 
  //       setOpen={setOpen}
  //       />
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuSeparator/>
  //           <DropdownMenuItem onClick={()=>{router.push(`/dashboard/${params.storeId}/billboards/${billboardId}`)}}>
  //             <Edit className="h-4 w-4 mr-2"/>
  //             Update
  //           </DropdownMenuItem>
  //           <DropdownMenuItem onClick={()=>{setOpen(true)}}>
  //             <Trash2 className='h-4 w-4 mr-2'/> 
  //             Delete
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //       </>
  //     )
  //   },
  // },
]
