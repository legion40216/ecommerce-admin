import React from 'react'
import { Separator } from '@/components/ui/separator';
import { formatter } from '@/lib/utils';
import Headings from '@/components/custom-ui/headings';
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} 
    from '@/components/ui/card';
import { CreditCard, DollarSign, Package } from 'lucide-react';
import { getTotalRevenue } from '@/app/actions/get-total-revenue';
import { getSalesCount } from '@/app/actions/get-sales-count';
import { getStockCount } from '@/app/actions/get-stock-count';
import { getRevenueData } from '@/app/actions/get-revenue-data';
import Overview from './components/overview';

export default async function page({params}) {
    const totalRevenue = await getTotalRevenue(params.storeId)
    const salesCount   = await getSalesCount(params.storeId)
    const stockCount  = await getStockCount(params.storeId)
    const revenueData = await getRevenueData(params.storeId)

  return (
    <div className="space-y-3">
        <div className="flex justify-between items-center">
             <Headings
              title={"Dashboard"}
              discription={"Overview of your store"}
              />
          </div>

        <Separator/>

        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                    Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                    {formatter.format(totalRevenue)}
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                    Sales
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                    +{salesCount}
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                    Stock
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                    {stockCount}
                    </div>
                </CardContent>
                </Card>
            </div>
            <div className="">
            <Card>
                <CardHeader>
                    <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                <Overview 
                    data={revenueData}
                    />
                </CardContent>
                </Card>
            </div>
        </div>
    </div>
  )
}
