import { getCategoryList } from "./category.repository";
import { createCategoryService, getAllCategoriesService, getCategoryByNameService } from "./category.service";
import { Request,Response } from "express";

export const createCategoryController =async(req:Request,res:Response) =>{
    const {name,description} = req.body;

    const category = await createCategoryService(name,description);

    return res.status(201).json({
        success:true,
        message:"Category created successfully",
        data:category
    })
}

export const getAllCategoriesContoller = async(req:Request,res:Response) =>{
    const categories = await getAllCategoriesService();

    return res.status(200).json({
        success:true,
        data:categories
    })
}

export const getCategoryContoller= async(req:Request,res:Response) =>{
    const category = await getCategoryByNameService(req.params.name as string)

    return res.status(200).json({
        success:true,
        data:category
    })
}

export const getCategoryListController= async(req:Request,res:Response) =>{
    const categoryList = await getCategoryList();

    return res.status(200).json({
        success:true,
        data:categoryList
    })
}