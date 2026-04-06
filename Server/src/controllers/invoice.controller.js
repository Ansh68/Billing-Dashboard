import { prisma } from "../db/prisma.js";
import { generateInvoiceId } from "../utils/generateInvoiceId.js";

const createInvoice = async (req, res) => {
    try {
        const { customerId, items } = req.body;


        if (!customerId || !items || items.length === 0) {
            return res.status(400).json({
                error: "Customer and at least one item are required",
            });
        }


        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
        });

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }


        if (!customer.isActive) {
            return res.status(400).json({
                error: "Cannot create invoice for inactive customer",
            });
        }


        for (const i of items) {
            if (!i.itemId || !i.quantity) {
                return res.status(400).json({
                    error: "Each item must have itemId and quantity",
                });
            }

            if (!Number.isInteger(i.quantity) || i.quantity <= 0) {
                return res.status(400).json({
                    error: "Quantity must be a positive integer",
                });
            }
        }

        let subtotal = 0;


        const itemIds = items.map(i => i.itemId);
        const dbItems = await prisma.item.findMany({
            where: { id: { in: itemIds } },
        });


        if (dbItems.length !== itemIds.length) {
            return res.status(400).json({
                error: "One or more items not found",
            });
        }


        const invoiceItemsData = items.map((i) => {
            const item = dbItems.find(d => d.id === i.itemId);

            if (!item) {
                throw new Error(`Item not found: ${i.itemId}`);
            }

            if (!item.isActive) {
                throw new Error(`Item ${item.name} is inactive`);
            }

            const total = item.price * i.quantity;
            subtotal += total;

            return {
                itemId: item.id,
                quantity: i.quantity,
                price: item.price,
                total,
            };
        });


        const gstApplicable = !customer.gstNumber;
        const gstAmount = gstApplicable ? Math.round(subtotal * 0.18) : 0;
        const totalAmount = subtotal + gstAmount;


        const invoiceId = generateInvoiceId();


        const invoice = await prisma.$transaction(async (tx) => {
            const createdInvoice = await tx.invoice.create({
                data: {
                    invoiceId,
                    customerId,
                    subtotal,
                    gstAmount,
                    totalAmount,
                },
            });

            await tx.invoiceItem.createMany({
                data: invoiceItemsData.map(i => ({
                    ...i,
                    invoiceId: createdInvoice.id,
                })),
            });

            return createdInvoice;
        });

        res.status(201).json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllInvoices = async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                customer: true,
                items: {
                    include: {
                        item: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getInvoiceByInvoiceId = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await prisma.invoice.findUnique({
            where: { invoiceId },
            include: {
                customer: true,
                items: {
                    include: {
                        item: true,
                    },
                },
            },
        });

        if (!invoice) {
            return res.status(404).json({ error: "Invoice not found" });
        }

        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { createInvoice, getAllInvoices, getInvoiceByInvoiceId };