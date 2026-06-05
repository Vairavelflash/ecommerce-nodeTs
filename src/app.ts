import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from "helmet"
import prisma from './lib/prisma';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from './config/swagger.js';
import { errorMiddleware } from './middleware/error.middleware';
import routes from "./routes"
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
    res.json({
        success:true,
        message:"Ecommerce API Running"
    })
})



app.use('/api/v1',routes)


app.use(errorMiddleware);

export default app;