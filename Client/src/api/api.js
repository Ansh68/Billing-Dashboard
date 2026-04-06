import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


export const getCustomers = () => API.get("/customers");
export const createCustomer = (data) => API.post("/customers", data);
export const deleteCustomer = (id) => API.delete(`/customers/${id}`);


export const getItems = () => API.get("/items");
export const createItem = (data) => API.post("/items", data);
export const deleteItem = (id) => API.delete(`/items/${id}`);


export const getAllInvoices = () => API.get("/invoices");
export const getInvoiceById = (invoiceId) => API.get(`/invoices/${invoiceId}`);
export const createInvoice = (data) => API.post("/invoices", data);

export default API;
