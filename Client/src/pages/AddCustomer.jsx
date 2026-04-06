import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { createCustomer } from "../api/api";

export default function AddCustomer() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        address: "",
        panCard: "",
        gstNumber: "",
        isActive: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async () => {

        if (!form.name.trim()) {
            setError("Customer Name is required");
            return;
        }
        if (!form.address.trim()) {
            setError("Customer Address is required");
            return;
        }
        if (!form.panCard.trim()) {
            setError("PAN Card Number is required");
            return;
        }

        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        if (!panRegex.test(form.panCard.toUpperCase())) {
            setError("Invalid PAN Card format (Example: ABCDE1234F)");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await createCustomer({
                name: form.name.trim(),
                address: form.address.trim(),
                panCard: form.panCard.toUpperCase().trim(),
                gstNumber: form.gstNumber.trim() || null,
                isActive: form.isActive,
            });
            setSuccess(true);
            setTimeout(() => navigate("/master/customers"), 1200);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create customer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#1a1a6e" }}>
                Add New Customer
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}


            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, maxWidth: 600 }}>

                <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
                            Customer Name <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={form.name}
                            onChange={handleChange("name")}
                            placeholder="Enter customer name"
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
                            Customer Address <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={form.address}
                            onChange={handleChange("address")}
                            placeholder="Enter address"
                        />
                    </Box>
                </Box>


                <Box sx={{ display: "flex", gap: 3 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
                            Customer Pan Card Number <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={form.panCard}
                            onChange={handleChange("panCard")}
                            placeholder="e.g. ABCDE1234F"
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
                            Customer GST Number
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={form.gstNumber}
                            onChange={handleChange("gstNumber")}
                            placeholder="Optional"
                            inputProps={{ style: { textTransform: "uppercase" } }}
                        />
                    </Box>
                </Box>

                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
                        Customer Status
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <Select
                            value={form.isActive}
                            onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value }))}
                        >
                            <MenuItem value={true}>Active</MenuItem>
                            <MenuItem value={false}>In-Active</MenuItem>
                        </Select>
                    </FormControl>
                </Box>


                <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/master/customers")}
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
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{
                            bgcolor: "#1a1a6e",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                            "&:hover": { bgcolor: "#2d2d8e" },
                        }}
                    >
                        {loading ? "Creating..." : "Create"}
                    </Button>
                </Box>
            </Box>

            <Snackbar
                open={success}
                autoHideDuration={2000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" variant="filled">
                    Customer created successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}
