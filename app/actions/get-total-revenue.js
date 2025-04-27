import prismadb from '@/lib/prismadb';

export const getTotalRevenue = async (storeId) => {
  const paidOrders = await prismadb.order.findMany({
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

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      // Multiply the product price by the count to get the total for each item
      return orderSum + item.product.price.toNumber() * item.count;
    }, 0);

    return total + orderTotal;
  }, 0);

  return totalRevenue;
};