import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
    "origin": process.env.CORS_ORIGIN,
    "credentials": true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



import customerRoutes from "./routes/customer.routes.js";
import itemRoutes from "./routes/item.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";

app.use("/customers", customerRoutes);
app.use("/items", itemRoutes);
app.use("/invoices", invoiceRoutes);

export {app};