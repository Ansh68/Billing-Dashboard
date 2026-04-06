import { Outlet, NavLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

const navItems = [
    { label: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/" },
    { label: "Master", icon: <SettingsIcon fontSize="small" />, path: "/master" },
    { label: "Billing", icon: <ReceiptLongIcon fontSize="small" />, path: "/billing" },
];

export default function Layout() {
    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>

            <Box
                sx={{
                    width: 80,
                    bgcolor: "#fff",
                    borderRight: "1px solid #e0e0e0",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: 2,
                    gap: 1,
                }}
            >
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        style={{ textDecoration: "none" }}
                    >
                        {({ isActive }) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    py: 1.2,
                                    px: 1,
                                    borderRadius: 1,
                                    cursor: "pointer",
                                    color: isActive ? "#1a1a6e" : "#888",
                                    "&:hover": { color: "#1a1a6e" },
                                }}
                            >
                                {item.icon}
                                <Typography sx={{ fontSize: 11, mt: 0.3, fontWeight: isActive ? 600 : 400 }}>
                                    {item.label}
                                </Typography>
                            </Box>
                        )}
                    </NavLink>
                ))}
            </Box>


            <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

                <Box
                    sx={{
                        height: 48,
                        background: "linear-gradient(90deg, #1a1a6e 0%, #2d2d8e 100%)",
                    }}
                />


                <Box sx={{ flex: 1, p: 3 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
