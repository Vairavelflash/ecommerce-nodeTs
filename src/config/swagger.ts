import swaggerJsdoc from "swagger-jsdoc";

const options ={
    definition: {
        openapi: "3.0.0",
        info:{
            title:"Ecommerce API",
            version: "1.0.0"
        }
    },
    apis:["./src/modules/**/*.ts"],
}

export const swaggerSpec = swaggerJsdoc(options)