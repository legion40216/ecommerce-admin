import prismadb from '@/lib/prismadb';

export const getRevenueData = async (storeId) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue = {}; // No TypeScript-style typing

  for (const order of orders) {
    const month = order.createdAt.getMonth(); // Get the month from the order's creation date
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      // Calculate revenue based on count and price
      revenueForOrder += parseFloat(item.product.price) * item.count; // Multiply by item.count
    }

    // Accumulate the revenue for the month
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  const graphData = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};