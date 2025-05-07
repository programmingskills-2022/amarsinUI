import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { AppBar, Box, CssBaseline } from "@mui/material";

import ToolBar from "./ToolBar";

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <Box className="focus:outline-none select-none" sx={{ display: "flex" }}>
      <CssBaseline />
      {!isLoginPage && (
        <>
          {/* AppBar */}
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "#eeeeee",
            }}
          >
            <ToolBar />
          </AppBar>
        </>
      )}
      {!isLoginPage && (
        <div className="w-full flex flex-col justify-start sm:flex-row mt-12 sm:mt-16">
          {/* SideMenu on the Right */}
          <SideMenu />
          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
            }}
          >
            {children}
          </Box>
        </div>
      )}
      {isLoginPage && (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default Layout;
