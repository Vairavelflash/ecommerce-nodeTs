import { createCategoryService, getAllCategoriesService } from "./category.service";
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