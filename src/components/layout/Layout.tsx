import React, { ReactNode,  useMemo } from "react";
import { useLocation } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { AppBar, Box, CssBaseline } from "@mui/material";
import { useGeneralContext } from "../../context/GeneralContext";
import ToolBar from "./ToolBar";
import axios from "axios";
import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";

interface Props {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const {  setUrl, isMenuOpened } = useGeneralContext();
  const { isAuthenticated } = useAuthStore();

  const customerCode = localStorage.getItem("customerCode");

  const setApiUrl = async () => {
    const response = await axios.get(
      `${api.defaults.baseURL}/api/AppConfig/${customerCode}`
    );
    const url = response.data.data?.result.url ?? "";
    setUrl(url.slice(0, url.length - 4));
  };

  useMemo(() => {
    setApiUrl();
  }, [isAuthenticated]);

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
          <SideMenu />
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
