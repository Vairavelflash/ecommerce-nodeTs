import prisma from "../../lib/prisma";
import { createProduct, deleteProduct, getAllProducts, getProductsById, getProductsCount, getSearchProducts, getSearchProducts2, updateProduct } from "./product.repository";

type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
};

export const createProductService = async (data: CreateProductInput) => {
  // Check
  const category = await prisma.category.findUnique({
    where: {
      id: data.categoryId,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return createProduct(data);
};

export const getAllProductsService = async (page:number,limit:number,search?:string) => {
  const skip = (page-1)*limit;

  const where = search ? {
    name:{
      contains:search,
      mode:"insensitive" as const
    },
    isDeleted: false
  }: {
    isDeleted: false
  }
  
  const [products,total] = await Promise.all([getAllProducts(where,skip,limit),getProductsCount(where)])
  return {
    products,
    pagination:{
      total,
      page,
      limit,
      totalPages: Math.ceil(total/limit)
    }
  }
};

export const getSearchProductsService = async (search:string) => {
  console.log('first',search)
  // return getSearchProducts(search);
  return getSearchProducts2(search)
};

export const getProductByIdService =async(id:string) =>{
  const product = await getProductsById(id);

  if(!product){
    throw new Error("Product not found")
  }
  return product
}

export const updateProductService = async(id:string,data:CreateProductInput) =>{
  const product = await getProductsById(id);

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    return updateProduct(id, data);

}

export const deleteProductService =
  async (id: string) => {
    const product =
      await getProductsById(id);

    if (!product) {
      throw new Error(
        "Product not found"
      );
    }

    return deleteProduct(id);
  };