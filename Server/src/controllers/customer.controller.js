import { prisma } from "../db/prisma.js";

const createCustomer = async (req, res) => {
  try {
    const { name, address, panCard, gstNumber, isActive } = req.body;

    if (!name || !address || !panCard) {
      return res.status(400).json({
        error: "Name, Address, and PAN Card are required",
      });
    }

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    if (!panRegex.test(panCard)) {
      return res.status(400).json({
        error: "Invalid PAN Card format (Example: ABCDE1234F)",
      });
    }

    let formattedGst = gstNumber || null;

    if (formattedGst) {
      formattedGst = formattedGst.toUpperCase();
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        address,
        panCard: panCard.toUpperCase(),
        gstNumber: formattedGst,
        isActive: isActive ?? true,
      },
    });

    res.status(201).json(customer);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({
        error: "PAN Card or GST Number already exists",
      });
    }

    res.status(500).json({ error: err.message });
  }
};


const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.customer.delete({
      where: { id },
    });

    res.json({ message: "Customer deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createCustomer, getCustomers, deleteCustomer };