"use client"
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'
import { cn } from '@/lib/utils'

export default function MainNav() {
    const pathName = usePathname()
    const params = useParams()

    const routes = [
        {
            href: `/${params.storeId}`,
            label: 'Overview',
            active: pathName === `/${params.storeId}`
        },
        {
            href: `/${params.storeId}/settings`,
            label: 'Settings',
            active: pathName === `/${params.storeId}/settings`
        },
        {
            href: `/${params.storeId}/billboards`,
            label: 'Billboards',
            active: pathName === `/${params.storeId}/billboards`
        },
        {
            href: `/${params.storeId}/sizes`,
            label: 'Sizes',
            active: pathName === `/${params.storeId}/sizes`
        },
        {
            href: `/${params.storeId}/colors`,
            label: 'Colors',
            active: pathName === `/${params.storeId}/colors`
        },
        {
            href: `/${params.storeId}/categories`,
            label: 'Categories',
            active: pathName === `/${params.storeId}/categories`
        },
        {
            href: `/${params.storeId}/products`,
            label: 'Products',
            active: pathName === `/${params.storeId}/products`
        },
        {
            href: `/${params.storeId}/orders`,
            label: 'Orders',
            active: pathName === `/${params.storeId}/orders`
        },
    ]

    return (
        <div className="flex gap-2">
            {routes.map((route, index) => (
                <Link 
                    key={index}
                    href={route.href}
                    className={cn(
                        "text-sm font-bold transition-colors hover:text-primary",
                        route.active ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </div>
    )
}