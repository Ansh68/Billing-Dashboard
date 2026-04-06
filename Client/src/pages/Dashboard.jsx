import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { getAllInvoices } from "../api/api";

export default function Dashboard() {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await getAllInvoices();
            setInvoices(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch invoices");
        } finally {
            setLoading(false);
        }
    };


    const filteredInvoices = invoices.filter((inv) =>
        inv.invoiceId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#1a1a6e" }}>
                Dashboard
            </Typography>


            <TextField
                placeholder="Search by Invoice ID"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                    mb: 3,
                    width: 300,
                    bgcolor: "#fff",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#ccc" },
                        "&:hover fieldset": { borderColor: "#1a1a6e" },
                        "&.Mui-focused fieldset": { borderColor: "#1a1a6e" },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#999", fontSize: 20 }} />
                        </InputAdornment>
                    ),
                }}
            />

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                    <CircularProgress sx={{ color: "#1a1a6e" }} />
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #ddd" }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#1a1a6e" }}>
                                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Invoice ID</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Customer name</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Item name (s)</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ color: "#fff", fontWeight: 600 }} align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredInvoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#999" }}>
                                        {search ? "No invoices match your search" : "No invoices found"}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInvoices.map((inv) => (
                                    <TableRow
                                        key={inv.id}
                                        sx={{ "&:hover": { bgcolor: "#f8f9ff" } }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>{inv.invoiceId}</TableCell>
                                        <TableCell>{inv.customer?.name || "—"}</TableCell>
                                        <TableCell>{inv.items?.map((entry) => entry.item?.name).filter(Boolean).join(", ") || "—"}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {inv.totalAmount.toLocaleString("en-IN")}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => navigate(`/invoice/${inv.invoiceId}`)}
                                                sx={{
                                                    bgcolor: "#1a1a6e",
                                                    textTransform: "none",
                                                    fontWeight: 500,
                                                    px: 2.5,
                                                    "&:hover": { bgcolor: "#2d2d8e" },
                                                }}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}
