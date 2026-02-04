import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { AppBar, Box, CssBaseline } from "@mui/material";
import { useGeneralContext } from "../../context/GeneralContext";
import ToolBar from "./ToolBar";
import { DefinitionInvironment } from "../../types/definitionInvironment";

interface Props {
  children: ReactNode;
  definitionInvironment: DefinitionInvironment;
}

const Layout: React.FC<Props> = ({ children, definitionInvironment }) => {
  const location = useLocation();
  const {   isMenuOpened } = useGeneralContext();
  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <Box
      className="focus:outline-none select-none md:overflow-y-hidden"
      sx={{ display: "flex", height: "100vh" }}
    >
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
          <SideMenu definitionInvironment={definitionInvironment} />
          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: {
                xs: "100%", // Always 100% width on mobile
                sm: "100%", // Always 100% width on small screens
                md: isMenuOpened ? "calc(100% - 288px)" : "100%", // Responsive width on medium and larger screens
              },
              transition: "width 0.3s ease-in-out",
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
