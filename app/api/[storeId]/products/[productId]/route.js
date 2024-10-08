import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
    try {
        // Authenticate the user
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Parse the request body
        const body = await request.json();
        const {
            name, price, isFeatured, isArchived, categoryId, colorId, sizeId, images, location, quantity,
            weight, shapeId, clarityId, cutId, length, width, depth, lusterId,
            treatment, certification, origin, rarityFactor, inclusions, fluorescence,
            zodiacId 
        } = body;

        if (!name || !price || !categoryId || !colorId || !sizeId || !images || !params.productId || !location || !weight || !shapeId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Perform a transaction to update the product and handle images
        const product = await prisma.$transaction(async (prisma) => {
  
            const updatedProduct = await prisma.product.update({
                where: { id: params.productId },
                data: {
                    name,
                    price,
                    isFeatured,
                    isArchived,
                    categoryId,
                    colorId,
                    sizeId,
                    location,
                    quantity,
                    weight,
                    shapeId,
                    clarityId,
                    cutId,
                    length,
                    width,
                    depth,
                    lusterId,
                    treatment,
                    certification,
                    origin,
                    rarityFactor,
                    inclusions,
                    fluorescence,
                    zodiacId
                },
            });

            // Delete existing images associated with the product
            await prisma.image.deleteMany({
                where: { productId: params.productId },
            });

            // Create new images
            await prisma.image.createMany({
                data: images.map((image) => ({
                    url: image.url,
                    productId: params.productId,
                })),
            });

            return updatedProduct;
        });

        // Return the updated product as a JSON response
        return NextResponse.json(product);
    } catch (error) {
        console.error('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function DELETE(request, { params }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const product = await prisma.product.delete({
            where: { id: params.productId },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(request, { params }) {
    try {
        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: params.productId },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
                shape: true,
                clarity: true,
                cut: true,
                luster: true,
                zodiac: true,
            },
        });

        if (!product) {
            return new NextResponse("Product not found", { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error('[PRODUCT_GET]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}