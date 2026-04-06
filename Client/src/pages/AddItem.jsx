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
import { createItem } from "../api/api";

export default function AddItem() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        price: "",
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
            setError("Item Name is required");
            return;
        }
        if (!form.price || Number(form.price) <= 0) {
            setError("Selling Price must be a positive number");
            return;
        }
        if (!Number.isInteger(Number(form.price))) {
            setError("Price must be an integer");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await createItem({
                name: form.name.trim(),
                price: Number(form.price),
                isActive: form.isActive,
            });
            setSuccess(true);
            setTimeout(() => navigate("/master/items"), 1200);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#1a1a6e" }}>
                Add New Item
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
                            Item Name <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={form.name}
                            onChange={handleChange("name")}
                            placeholder="Enter item name"
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
                            Customer Selling Price <span style={{ color: "red" }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={form.price}
                            onChange={handleChange("price")}
                            placeholder="Enter price"
                        />
                    </Box>
                </Box>

                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
                        Customer Status <span style={{ color: "red" }}>*</span>
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
                        onClick={() => navigate("/master/items")}
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
                    Item created successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}
