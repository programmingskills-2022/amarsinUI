import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import SideMenu from "../sideMenu/SideMenu";
import { AppBar, Toolbar, Box, CssBaseline, Drawer } from "@mui/material";
import { useAuthStore } from "../../store/authStore";
import MenuIcon from "@mui/icons-material/Menu";
import { convertToFarsiDigits } from "../../utilities/general";
import { useGeneralContext } from "../../context/GeneralContext";

interface Props {
  children: ReactNode;
}

const drawerWidth = 300;

const Layout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
 
  const {treeNodeTitle,setIsMenuOpened,isMenuOpened} = useGeneralContext()

  const { authApiResponse } = useAuthStore();

  // Check if the current route is the login page
  const isLoginPage = location.pathname === "/login";

  const appConfig = authApiResponse?.data.result.appConfig;
  const initData = authApiResponse?.data.result.initData;
 
  const toggleMenu= ()=>{
    setIsMenuOpened(!isMenuOpened)
  }

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
              <div className="flex">
                <div className='hover:cursor-pointer' onClick={toggleMenu}>
                  <MenuIcon />
                </div>
                <label>سامانه جامع حسابداری داتیس</label>
              </div>
              <div className="flex">
                <span className="text-cyan-800 font-bold">{treeNodeTitle || ""}</span>
              </div>

              <div className="flex"></div>
            </Toolbar>
          </AppBar>
          {/* SideMenu on the Right */}
          <div className="h-[calc(100vh-72px)] mt-16 overflow-y-auto bg-gray-200" >
            <SideMenu />
          </div>

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