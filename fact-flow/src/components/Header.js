import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import "../styles/Header.css";

function Header() {

    return (
        <AppBar
            sx={{
                bgcolor: "white"
            }}
            >
            <Toolbar>
                <Button
                    onClick
                    display = "flex"
                    sx={{
                        color: "black",
                        "&:hover": {
                            color: "blue"
                        },
                        textTransform: "none"
                    }}
                >Home</Button>
                <Button
                    onClick
                    display = "flex"
                    sx={{
                        color: "black",
                        "&:hover": {
                            color: "blue"
                        },
                        textTransform: "none"
                    }}
                >Login</Button>
            </Toolbar>
        </AppBar>
    )

}

export default Header;