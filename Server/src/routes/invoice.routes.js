import express from "express";
import {
  createInvoice,
  getAllInvoices,
  getInvoiceByInvoiceId,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.post("/", createInvoice);
router.get("/", getAllInvoices);
router.get("/:invoiceId", getInvoiceByInvoiceId);

export default router;