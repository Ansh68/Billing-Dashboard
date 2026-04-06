import { prisma } from "../db/prisma.js";

const createItem = async (req, res) => {
    try {
        const { name, price, isActive } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({
                error: "Name and Price are required",
            });
        }


        if (name.trim() === "") {
            return res.status(400).json({
                error: "Item name cannot be empty",
            });
        }


        const parsedPrice = Number(price);

        if (!Number.isInteger(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({
                error: "Price must be a positive integer",
            });
        }


        if (!Number.isInteger(price)) {
            return res.status(400).json({
                error: "Price must be an integer",
            });
        }


        if (price <= 0) {
            return res.status(400).json({
                error: "Price must be greater than 0",
            });
        }

        const item = await prisma.item.create({
            data: {
                name: name.trim(),
                price,
                isActive: isActive ?? true,
            },
        });

        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getItems = async (req, res) => {
    try {
        const items = await prisma.item.findMany();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.item.delete({
            where: { id },
        });

        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { createItem, getItems, deleteItem };