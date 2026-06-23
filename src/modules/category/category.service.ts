import { createCategory, getAllCategories, getCategoryByName, getCategoryCount } from "./category.repository"


export const createCategoryService = async(name:string,description:string) =>{
    const existingCategory = await getCategoryByName(name);

    if(existingCategory){
        throw new Error("Category already exists")
    }

    return createCategory({name,description})
}

export const getCategoriesService= async (page:number,limit:number,search?:string) =>{
    const skip = (page-1) * limit;

    const where = search ? {
        name:{
            contains:search,
            mode:"insensitive" as const
        }
    }: {}

    const [categories, total] = await Promise.all([getAllCategories(where,skip,limit),getCategoryCount(where)])

    return {
        categories,
        pagination:{
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit)
        }
    }
}

export const getCategoryByNameService= async(name:string)=>{
    return getCategoryByName(name)
}