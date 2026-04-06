import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const cards = [
    {
        title: "Customer",
        description: "Read or Create customer data",
        path: "/master/customers",
    },
    {
        title: "Items",
        description: "Read or Create Items data",
        path: "/master/items",
    },
];

export default function Master() {
    const navigate = useNavigate();

    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: "#1a1a6e" }}>
                Master
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {cards.map((card) => (
                    <Paper
                        key={card.title}
                        elevation={0}
                        onClick={() => navigate(card.path)}
                        sx={{
                            border: "1px solid #ddd",
                            p: 2.5,
                            width: 200,
                            cursor: "pointer",
                            transition: "box-shadow 0.2s",
                            "&:hover": {
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                borderColor: "#1a1a6e",
                            },
                        }}
                    >
                        <Typography sx={{ fontWeight: 600, fontSize: 15, mb: 0.5 }}>
                            {card.title}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#777" }}>
                            {card.description}
                        </Typography>
                    </Paper>
                ))}
            </Box>
        </Box>
    );
}
