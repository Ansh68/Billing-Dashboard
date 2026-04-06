import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getCustomers, getItems, createInvoice } from "../api/api";

export default function Billing() {

    const [customer, setCustomer] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [generatedInvoice, setGeneratedInvoice] = useState(null);


    const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
    const [itemDialogOpen, setItemDialogOpen] = useState(false);


    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);


    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const openCustomerDialog = async () => {
        setCustomerDialogOpen(true);
        setLoadingCustomers(true);
        try {
            const res = await getCustomers();
            setCustomers(res.data);
        } catch {
            setError("Failed to load customers");
        } finally {
            setLoadingCustomers(false);
        }
    };


    const openItemDialog = async () => {
        setItemDialogOpen(true);
        setLoadingItems(true);
        try {
            const res = await getItems();
            setItems(res.data);
        } catch {
            setError("Failed to load items");
        } finally {
            setLoadingItems(false);
        }
    };


    const handleSelectCustomer = (cust) => {
        setCustomer(cust);
        setCustomerDialogOpen(false);
    };


    const [dialogItemQty, setDialogItemQty] = useState({});

    const handleDialogAddItem = (item) => {
        setDialogItemQty((prev) => ({ ...prev, [item.id]: 1 }));
    };

    const handleDialogIncrement = (itemId) => {
        setDialogItemQty((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 1) + 1,
        }));
    };

    const handleDialogDecrement = (itemId) => {
        setDialogItemQty((prev) => {
            const current = prev[itemId] || 1;
            if (current <= 1) {

                const updated = { ...prev };
                delete updated[itemId];
                return updated;
            }
            return { ...prev, [itemId]: current - 1 };
        });
    };

    const handleConfirmItems = () => {
        const newItems = Object.entries(dialogItemQty).map(([itemId, qty]) => {
            const item = items.find((i) => i.id === itemId);
            return { item, quantity: qty };
        });


        const merged = [...selectedItems];
        newItems.forEach((newEntry) => {
            const existingIdx = merged.findIndex((e) => e.item.id === newEntry.item.id);
            if (existingIdx >= 0) {
                merged[existingIdx].quantity += newEntry.quantity;
            } else {
                merged.push(newEntry);
            }
        });

        setSelectedItems(merged);
        setDialogItemQty({});
        setItemDialogOpen(false);
    };


    const incrementQty = (itemId) => {
        setSelectedItems((prev) =>
            prev.map((e) =>
                e.item.id === itemId ? { ...e, quantity: e.quantity + 1 } : e
            )
        );
    };

    const decrementQty = (itemId) => {
        setSelectedItems((prev) =>
            prev
                .map((e) =>
                    e.item.id === itemId ? { ...e, quantity: e.quantity - 1 } : e
                )
                .filter((e) => e.quantity >= 1)
        );
    };


    const subtotal = selectedItems.reduce(
        (sum, e) => sum + e.item.price * e.quantity,
        0
    );
    const isGstRegistered = !!customer?.gstNumber;
    const gstAmount = isGstRegistered ? 0 : Math.round(subtotal * 0.18);
    const totalAmount = subtotal + gstAmount;


    const handleCreate = async () => {
        if (!customer) {
            setError("Please select a customer");
            return;
        }
        if (selectedItems.length === 0) {
            setError("Please add at least one item");
            return;
        }

        try {
            setCreating(true);
            setError("");
            const res = await createInvoice({
                customerId: customer.id,
                items: selectedItems.map((e) => ({
                    itemId: e.item.id,
                    quantity: e.quantity,
                })),
            });
            setGeneratedInvoice(res.data);
            setSuccessMsg("Invoice created successfully!");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create invoice");
        } finally {
            setCreating(false);
        }
    };

    const handleNewBill = () => {
        setCustomer(null);
        setSelectedItems([]);
        setGeneratedInvoice(null);
    };


    if (generatedInvoice) {
        return (
            <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1a1a6e" }}>
                    Billing
                </Typography>

                <Paper elevation={0} sx={{ border: "1px solid #ddd", p: 3 }}>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Customer Details</Typography>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#555" }}>
                            Invoice ID: {generatedInvoice.invoiceId}
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />


                    <Box sx={{ mb: 3 }}>
                        <InfoRow label="Name" value={customer?.name} />
                        <InfoRow label="Address" value={customer?.address} />
                        <InfoRow label="Pan Card" value={customer?.panCard} />
                        <InfoRow label="GST Num" value={customer?.gstNumber || "N/A"} />
                    </Box>

                    <Divider sx={{ mb: 1 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1 }}>Items</Typography>


                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ borderBottom: "2px solid #333" }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedItems.map((e) => (
                                    <TableRow key={e.item.id}>
                                        <TableCell>{e.item.name}</TableCell>
                                        <TableCell align="center">{e.quantity}</TableCell>
                                        <TableCell align="right">
                                            {(e.item.price * e.quantity).toLocaleString("en-IN")}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {gstAmount > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} align="right" sx={{ fontWeight: 600, borderBottom: "none" }}>
                                            GST (18%)
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 500, borderBottom: "none" }}>
                                            {gstAmount.toLocaleString("en-IN")}
                                        </TableCell>
                                    </TableRow>
                                )}

                                <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                    <TableCell colSpan={2} align="right" sx={{ fontWeight: 700 }}>
                                        Total
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                                        {totalAmount.toLocaleString("en-IN")}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            onClick={handleNewBill}
                            sx={{
                                bgcolor: "#1a1a6e",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": { bgcolor: "#2d2d8e" },
                            }}
                        >
                            New Bill
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1a1a6e" }}>
                Billing
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                    {error}
                </Alert>
            )}

            <Paper elevation={0} sx={{ border: "1px solid #ddd", p: 3 }}>

                <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1 }}>Customer Details</Typography>
                <Divider sx={{ mb: 2 }} />

                {customer ? (
                    <Box sx={{ mb: 3 }}>
                        <InfoRow label="Name" value={customer.name} />
                        <InfoRow label="Address" value={customer.address} />
                        <InfoRow label="Pan Card" value={customer.panCard} />
                        <InfoRow label="GST Num" value={customer.gstNumber || "N/A"} />
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <IconButton onClick={openCustomerDialog} sx={{ color: "#1a1a6e" }}>
                            <AddCircleIcon sx={{ fontSize: 28 }} />
                            <Typography sx={{ fontWeight: 600, fontSize: 14, ml: 0.5 }}>ADD</Typography>
                        </IconButton>
                    </Box>
                )}

                {customer && (
                    <>
                        <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 1 }}>Items</Typography>
                        <Divider sx={{ mb: 2 }} />

                        {selectedItems.length > 0 ? (
                            <>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ borderBottom: "2px solid #333" }}>
                                                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedItems.map((e) => (
                                                <TableRow key={e.item.id}>
                                                    <TableCell>{e.item.name}</TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => incrementQty(e.item.id)}
                                                                sx={{
                                                                    border: "1px solid #ccc",
                                                                    borderRadius: 0.5,
                                                                    width: 24,
                                                                    height: 24,
                                                                }}
                                                            >
                                                                <AddIcon sx={{ fontSize: 14 }} />
                                                            </IconButton>
                                                            <Typography sx={{ mx: 0.5, fontSize: 14, minWidth: 20, textAlign: "center" }}>
                                                                {e.quantity}
                                                            </Typography>
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => decrementQty(e.item.id)}
                                                                sx={{
                                                                    border: "1px solid #ccc",
                                                                    borderRadius: 0.5,
                                                                    width: 24,
                                                                    height: 24,
                                                                }}
                                                            >
                                                                <RemoveIcon sx={{ fontSize: 14 }} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {(e.item.price * e.quantity).toLocaleString("en-IN")}
                                                    </TableCell>
                                                </TableRow>
                                            ))}


                                            {gstAmount > 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={2} align="right" sx={{ fontWeight: 600, borderBottom: "none" }}>
                                                        GST (18%)
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500, borderBottom: "none" }}>
                                                        {gstAmount.toLocaleString("en-IN")}
                                                    </TableCell>
                                                </TableRow>
                                            )}


                                            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                                <TableCell colSpan={2} align="right" sx={{ fontWeight: 700 }}>
                                                    Total
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700 }}>
                                                    {totalAmount.toLocaleString("en-IN")}
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>


                                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, mt: 3 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleNewBill}
                                        sx={{
                                            color: "#c62828",
                                            borderColor: "#c62828",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            px: 3,
                                            "&:hover": { borderColor: "#b71c1c", bgcolor: "#fce4ec" },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        onClick={handleCreate}
                                        disabled={creating}
                                        sx={{
                                            bgcolor: "#1a1a6e",
                                            textTransform: "none",
                                            fontWeight: 600,
                                            px: 3,
                                            "&:hover": { bgcolor: "#2d2d8e" },
                                        }}
                                    >
                                        {creating ? "Creating..." : "Create"}
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                                <IconButton onClick={openItemDialog} sx={{ color: "#1a1a6e" }}>
                                    <AddCircleIcon sx={{ fontSize: 28 }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: 14, ml: 0.5 }}>ADD</Typography>
                                </IconButton>
                            </Box>
                        )}
                    </>
                )}
            </Paper>


            <Dialog
                open={customerDialogOpen}
                onClose={() => setCustomerDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Select Customer</Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setCustomerDialogOpen(false)}
                        sx={{
                            color: "#c62828",
                            borderColor: "#c62828",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { borderColor: "#b71c1c", bgcolor: "#fce4ec" },
                        }}
                    >
                        Cancel
                    </Button>
                </DialogTitle>
                <DialogContent>
                    {loadingCustomers ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress sx={{ color: "#1a1a6e" }} />
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                            {customers.map((cust) => (
                                <Paper
                                    key={cust.id}
                                    elevation={0}
                                    onClick={() => handleSelectCustomer(cust)}
                                    sx={{
                                        border: "1px solid #ddd",
                                        p: 2,
                                        width: 200,
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        transition: "border-color 0.2s",
                                        "&:hover": { borderColor: "#1a1a6e" },
                                    }}
                                >
                                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{cust.name}</Typography>
                                    <Chip
                                        label={cust.isActive ? "Active" : "In-Active"}
                                        size="small"
                                        sx={{
                                            alignSelf: "flex-end",
                                            fontSize: 11,
                                            fontWeight: 600,
                                            height: 22,
                                            bgcolor: cust.isActive ? "#e8f5e9" : "#fce4ec",
                                            color: cust.isActive ? "#2e7d32" : "#c62828",
                                            border: cust.isActive ? "1px solid #a5d6a7" : "1px solid #ef9a9a",
                                        }}
                                    />
                                </Paper>
                            ))}
                            {customers.length === 0 && (
                                <Typography sx={{ color: "#999", py: 2 }}>
                                    No customers found. Create one in the Master section.
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>


            <Dialog
                open={itemDialogOpen}
                onClose={() => {
                    setItemDialogOpen(false);
                    setDialogItemQty({});
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Select Items</Typography>
                </DialogTitle>
                <DialogContent>
                    {loadingItems ? (
                        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                            <CircularProgress sx={{ color: "#1a1a6e" }} />
                        </Box>
                    ) : (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 1 }}>
                            {items.map((item) => {
                                const qty = dialogItemQty[item.id];
                                const isAdded = qty !== undefined;

                                return (
                                    <Paper
                                        key={item.id}
                                        elevation={0}
                                        sx={{
                                            border: "1px solid #ddd",
                                            p: 2,
                                            width: 200,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            opacity: item.isActive ? 1 : 0.7,
                                            bgcolor: item.isActive ? "#fff" : "#f5f5f5",
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{item.name}</Typography>

                                        {!item.isActive ? (
                                            <Chip
                                                label="In-Active"
                                                size="small"
                                                sx={{
                                                    alignSelf: "flex-end",
                                                    fontSize: 11,
                                                    fontWeight: 600,
                                                    height: 22,
                                                    bgcolor: "#fce4ec",
                                                    color: "#c62828",
                                                    border: "1px solid #ef9a9a",
                                                }}
                                            />
                                        ) : isAdded ? (
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.5 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDialogIncrement(item.id)}
                                                    sx={{ border: "1px solid #ccc", borderRadius: 0.5, width: 24, height: 24 }}
                                                >
                                                    <AddIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                                <Typography sx={{ mx: 0.5, fontSize: 14, minWidth: 20, textAlign: "center" }}>
                                                    {qty}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDialogDecrement(item.id)}
                                                    sx={{ border: "1px solid #ccc", borderRadius: 0.5, width: 24, height: 24 }}
                                                >
                                                    <RemoveIcon sx={{ fontSize: 14 }} />
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleDialogAddItem(item)}
                                                sx={{
                                                    alignSelf: "flex-end",
                                                    textTransform: "none",
                                                    fontWeight: 600,
                                                    fontSize: 12,
                                                    borderColor: "#1a1a6e",
                                                    color: "#1a1a6e",
                                                    px: 2,
                                                    "&:hover": { bgcolor: "#eef", borderColor: "#1a1a6e" },
                                                }}
                                            >
                                                ADD
                                            </Button>
                                        )}
                                    </Paper>
                                );
                            })}
                            {items.length === 0 && (
                                <Typography sx={{ color: "#999", py: 2 }}>
                                    No items found. Create one in the Master section.
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setItemDialogOpen(false);
                            setDialogItemQty({});
                        }}
                        sx={{
                            color: "#c62828",
                            borderColor: "#c62828",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { borderColor: "#b71c1c", bgcolor: "#fce4ec" },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirmItems}
                        disabled={Object.keys(dialogItemQty).length === 0}
                        sx={{
                            bgcolor: "#1a1a6e",
                            textTransform: "none",
                            fontWeight: 600,
                            "&:hover": { bgcolor: "#2d2d8e" },
                        }}
                    >
                        ADD
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!successMsg}
                autoHideDuration={3000}
                onClose={() => setSuccessMsg("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" variant="filled">
                    {successMsg}
                </Alert>
            </Snackbar>
        </Box>
    );
}


function InfoRow({ label, value }) {
    return (
        <Box sx={{ display: "flex", gap: 1, mb: 0.5 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 500, minWidth: 90 }}>{label}</Typography>
            <Typography sx={{ fontSize: 14, color: "#555" }}>: {value}</Typography>
        </Box>
    );
}
