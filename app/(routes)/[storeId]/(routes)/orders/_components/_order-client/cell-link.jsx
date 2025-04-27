"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button"; 

export default function CellLink({ products, paramsName }) {
  const params = useParams();

  return (
    <>
      {products.map((product, index) => (
        <Link
          href={`/${params.storeId}/${paramsName}/${product.id}`}
          className={`${buttonVariants({ variant: "link" })} !font-semibold !p-0`}
          key={product.id}
        >
          <span>{product.name}</span>
          {index < products.length - 1 && <span>,&nbsp;</span>}
        </Link>
      ))}
    </>
  );
}