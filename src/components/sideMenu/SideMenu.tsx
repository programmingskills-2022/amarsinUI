//import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore";
//import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { buildTree } from "./treeUtils";
import { TreeView } from "./TreeView";
import { MenuItem } from "../../types/menu";
import { useGeneralContext } from "../../context/GeneralContext";
import { useEffect, useState } from "react";

const SideMenu = () => {
  const { isMenuOpened } = useGeneralContext();

  const { authApiResponse, logout } = useAuthStore();
  // const navigate = useNavigate();
  // const { logout } = useAuthStore();

  // const handleLogout = () => {
  //   logout();
  //   navigate('/login');
  // };

  const userInfo = authApiResponse?.data.result.login;
  const initData = authApiResponse?.data.result.initData;
  const menu: MenuItem[] | undefined = authApiResponse?.data.result.menu;
  const [visible, setVisible] = useState(isMenuOpened);
  const tree = buildTree(menu ?? []);

  // Delay unmounting inner content for smooth transition
  useEffect(() => {
    if (isMenuOpened) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300); // match animation duration
      return () => clearTimeout(timeout);
    }
  }, [isMenuOpened]);

  const openLogin = () => {
    logout();
  };

  return (
    <aside
      className={`bg-white sm:h-[calc(100vh-72px)] sm:overflow-y-auto text-gray-600 text-sm flex flex-col transition-all duration-300 ${
        isMenuOpened ? "w-full sm:w-72" : "w-0 overflow-hidden h-0"
      }`}
    >
      {/* Top Section */}
      <div
        className={`transition-opacity duration-300 ${
          isMenuOpened ? "opacity-100" : "opacity-0"
        } ${visible ? "block" : "hidden"}`}
      >
        {/* User Info */}
        <div
          className="flex items-center justify-center border-y-2 p-2 hover:cursor-pointer"
          onClick={openLogin}
        >
          {userInfo?.nam || "کاربر سیستم"}
        </div>
        {/* سمت */}
        <div className="flex items-center justify-center p-2 hover:cursor-pointer">
          {initData?.chartTitle || "..."}
        </div>

        {/* Menu Header */}
        <h2 className="text-lg font-bold bg-cyan-600 text-gray-50 py-2 px-4">
          منوی نرم افزار
        </h2>
      </div>

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 text-gray-400">
        <TreeView data={tree} />
      </div>

      {/* Logout Icon */}
      {/* <div
        className="flex border-y-2 w-full justify-end p-2"
        onClick={handleLogout}
      >
        <PowerSettingsNewIcon className="text-gray-400 hover:cursor-pointer" />
      </div> */}
    </aside>
  );
};

export default SideMenu;
