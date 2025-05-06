import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { AppBar, Toolbar, Box, CssBaseline, Drawer } from "@mui/material";
import { useAuthStore } from "../../store/authStore";
import MenuIcon from "@mui/icons-material/Menu";
import { convertToFarsiDigits } from "../../utilities/general";

interface Props {
  children: ReactNode;
}

const drawerWidth = 300;

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const { authApiResponse } = useAuthStore();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/login";

  const appConfig = authApiResponse?.data.result.appConfig;
  const initData = authApiResponse?.data.result.initData;
  console.log(initData, appConfig, authApiResponse);

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
            <Toolbar className="text-gray-600 flex justify-between">
              <div>
                <MenuIcon />
                <label>سامانه جامع حسابداری داتیس</label>
              </div>

              <div className="flex items-start px-2 justify-between gap-8">
                <div>
                  <span className="text-sm"> سیستم: </span>
                  <span className="text-sm font-bold">{appConfig?.systemTitle || "..."}</span>
                </div>
                <div>
                  <span className="text-sm"> سال مالی: </span>
                  <span className="text-sm font-bold">{convertToFarsiDigits(initData?.yearTitle || "...")}</span>
                </div>
              </div>

              <div className="flex"></div>
            </Toolbar>
          </AppBar>

          {/* SideMenu on the Right */}
          <Drawer
            anchor="right" // Set the Drawer to appear on the right
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                height: `calc(100vh - 64px)`, // Full height minus AppBar height
                marginTop: "64px", // Push below the AppBar
                overflowY: "auto", // Enable vertical scrolling only
              },
            }}
          >
            <SideMenu />
          </Drawer>
        </>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;