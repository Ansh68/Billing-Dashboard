import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getInvoiceById } from "../api/api";

export default function InvoiceDetails() {
    const { invoiceId } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInvoice();
    }, [invoiceId]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const res = await getInvoiceById(invoiceId);
            setInvoice(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch invoice");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <CircularProgress sx={{ color: "#1a1a6e" }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 2 }}>
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{ color: "#1a1a6e", textTransform: "none" }}
                >
                    Back to Dashboard
                </Button>
            </Box>
        );
    }

    if (!invoice) return null;

    const customer = invoice.customer;
    const items = invoice.items || [];

    return (
        <Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                    sx={{ color: "#1a1a6e", textTransform: "none", fontWeight: 500, minWidth: "auto" }}
                >
                    Back
                </Button>
            </Box>

            <Paper elevation={0} sx={{ border: "1px solid #ddd", p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#1a1a6e" }}>
                    Invoice Details
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>Customer Details</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#555" }}>
                        Invoice ID: {invoice.invoiceId}
                    </Typography>
                </Box>


                <Box sx={{ mb: 3 }}>
                    <InfoRow label="Name" value={customer?.name} />
                    <InfoRow label="Address" value={customer?.address} />
                    <InfoRow label="Pan Card" value={customer?.panCard} />
                    <InfoRow label="GST Num" value={customer?.gstNumber || "N/A"} />
                </Box>

                <Divider sx={{ mb: 2 }} />


                <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 2 }}>Items</Typography>

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
                            {items.map((entry) => (
                                <TableRow key={entry.id}>
                                    <TableCell>{entry.item?.name || "—"}</TableCell>
                                    <TableCell align="center">{entry.quantity}</TableCell>
                                    <TableCell align="right">{entry.total.toLocaleString("en-IN")}</TableCell>
                                </TableRow>
                            ))}


                            {invoice.gstAmount > 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} align="right" sx={{ fontWeight: 600, borderBottom: "none" }}>
                                        GST (18%)
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 500, borderBottom: "none" }}>
                                        {invoice.gstAmount.toLocaleString("en-IN")}
                                    </TableCell>
                                </TableRow>
                            )}


                            {invoice.gstAmount > 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} align="right" sx={{ fontWeight: 600, borderBottom: "none" }}>
                                        Subtotal
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 500, borderBottom: "none" }}>
                                        {invoice.subtotal.toLocaleString("en-IN")}
                                    </TableCell>
                                </TableRow>
                            )}


                            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                                <TableCell colSpan={2} align="right" sx={{ fontWeight: 700 }}>
                                    Total
                                </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>
                                    {invoice.totalAmount.toLocaleString("en-IN")}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
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
