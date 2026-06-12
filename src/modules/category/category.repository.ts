import prisma from "../../lib/prisma"


export const createCategory = async (data:{
    name:string,description:string
}) =>{
    return prisma.category.create({
        data
    })
}

export const getCategoryByName = async (name:string) =>{
    return prisma.category.findFirst({
        where:{
            name:{
                contains:name.trim(),
                mode:"insensitive"
            }
        }
    })
}

export const getAllCategories = async() =>{
    return prisma.category.findMany({
        orderBy:{
            created_at:"desc"
        }
    })
}

export const getCategoryById = async() =>{
    
}

export const getCategoryList = async() =>{
    return prisma.category.findMany({
        select:{
            id:true,
            name:true
        },
        orderBy:{
            name:"asc"
        }
    })
}