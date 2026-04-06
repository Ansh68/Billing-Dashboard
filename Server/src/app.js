import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

const app = express();

app.use(cors({
    "origin": "*",
    "credentials": true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());


import customerRoutes from "./routes/customer.routes.js";
import itemRoutes from "./routes/item.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";

app.use("/customers", customerRoutes);
app.use("/items", itemRoutes);
app.use("/invoices", invoiceRoutes);

export {app};