import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { getItems } from "../api/api";

export default function ItemList() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await getItems();
            setItems(res.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to fetch items");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a6e" }}>
                    ITEMS
                </Typography>
                <IconButton
                    onClick={() => navigate("/master/items/add")}
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
            ) : items.length === 0 ? (
                <Typography sx={{ color: "#999", mt: 2 }}>
                    No items found. Click ADD to create one.
                </Typography>
            ) : (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {items.map((item) => (
                        <Paper
                            key={item.id}
                            elevation={0}
                            sx={{
                                border: "1px solid #ddd",
                                p: 2,
                                width: 190,
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                                {item.name}
                            </Typography>
                            <Chip
                                label={item.isActive ? "Active" : "In-Active"}
                                size="small"
                                sx={{
                                    alignSelf: "flex-end",
                                    fontSize: 11,
                                    fontWeight: 600,
                                    height: 22,
                                    bgcolor: item.isActive ? "#e8f5e9" : "#fce4ec",
                                    color: item.isActive ? "#2e7d32" : "#c62828",
                                    border: item.isActive ? "1px solid #a5d6a7" : "1px solid #ef9a9a",
                                }}
                            />
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
}
