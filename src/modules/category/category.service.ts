import { createCategory, getAllCategories, getCategoryByName } from "./category.repository"


export const createCategoryService = async(name:string,description:string) =>{
    const existingCategory = await getCategoryByName(name);

    if(existingCategory){
        throw new Error("Category already exists")
    }

    return createCategory({name,description})
}

export const getAllCategoriesService= async () =>{
    return getAllCategories();
}