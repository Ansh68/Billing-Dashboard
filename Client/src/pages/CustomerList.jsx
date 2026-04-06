import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getCustomers, deleteCustomer } from "../api/api";

export default function CustomerList() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Delete state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await getCustomers();
            setCustomers(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch customers");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (customer) => {
        setCustomerToDelete(customer);
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setCustomerToDelete(null);
    };

    const handleDeleteConfirm = async () => {
        if (!customerToDelete) return;
        try {
            setDeleting(true);
            await deleteCustomer(customerToDelete.id);
            setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
            setSnackbar({ open: true, message: `"${customerToDelete.name}" deleted successfully`, severity: "success" });
        } catch (err) {
            const msg = err.response?.data?.error || "Failed to delete customer";
            setSnackbar({ open: true, message: msg, severity: "error" });
        } finally {
            setDeleting(false);
            setDeleteDialogOpen(false);
            setCustomerToDelete(null);
        }
    };

    return (
        <Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a6e" }}>
                    CUSTOMERS
                </Typography>
                <IconButton
                    onClick={() => navigate("/master/customers/add")}
                    sx={{ color: "#1a1a6e" }}
                >
                    <AddCircleIcon sx={{ fontSize: 32 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: 14, ml: 0.5 }}>ADD</Typography>
                </IconButton>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                    <CircularProgress sx={{ color: "#1a1a6e" }} />
                </Box>
            ) : customers.length === 0 ? (
                <Typography sx={{ color: "#999", mt: 2 }}>
                    No customers found. Click ADD to create one.
                </Typography>
            ) : (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {customers.map((cust) => (
                        <Paper
                            key={cust.id}
                            elevation={0}
                            sx={{
                                border: "1px solid #ddd",
                                p: 2,
                                width: 190,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                position: "relative",
                                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                                "&:hover": {
                                    borderColor: "#b0b0e0",
                                    boxShadow: "0 2px 12px rgba(26,26,110,0.08)",
                                },
                                "&:hover .delete-btn": {
                                    opacity: 1,
                                },
                            }}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: 14, pr: 3 }}>
                                {cust.name}
                            </Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Chip
                                    label={cust.isActive ? "Active" : "In-Active"}
                                    size="small"
                                    sx={{
                                        fontSize: 11,
                                        fontWeight: 600,
                                        height: 22,
                                        bgcolor: cust.isActive ? "#e8f5e9" : "#fce4ec",
                                        color: cust.isActive ? "#2e7d32" : "#c62828",
                                        border: cust.isActive ? "1px solid #a5d6a7" : "1px solid #ef9a9a",
                                    }}
                                />
                                <Tooltip title="Delete customer" arrow>
                                    <IconButton
                                        className="delete-btn"
                                        size="small"
                                        onClick={() => handleDeleteClick(cust)}
                                        sx={{
                                            opacity: 0,
                                            color: "#c62828",
                                            transition: "opacity 0.2s ease, background 0.2s ease",
                                            "&:hover": {
                                                bgcolor: "#fce4ec",
                                            },
                                        }}
                                    >
                                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                        minWidth: 360,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: "#1a1a6e", pb: 0.5 }}>
                    Delete Customer
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: "#555", fontSize: 14 }}>
                        Are you sure you want to delete{" "}
                        <strong>{customerToDelete?.name}</strong>? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleDeleteCancel}
                        disabled={deleting}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            color: "#666",
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        disabled={deleting}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            bgcolor: "#c62828",
                            "&:hover": { bgcolor: "#b71c1c" },
                            borderRadius: 2,
                            px: 3,
                        }}
                    >
                        {deleting ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success / Error Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
