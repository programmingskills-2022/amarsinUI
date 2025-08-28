
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import MenuIcon from "@mui/icons-material/Menu";
import { Toolbar } from "@mui/material";
import { useGeneralContext } from "../../context/GeneralContext";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const ToolBar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { treeNodeTitle, setIsMenuOpened, isMenuOpened } = useGeneralContext();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };



  return (
    <Toolbar className="text-gray-600 flex justify-between">
      <div className="flex">
        <div className="hover:cursor-pointer" onClick={toggleMenu}>
          <MenuIcon />
        </div>
        <label className="hidden md:block">سامانه جامع حسابداری داتیس</label>
      </div>

      <div className="flex">
        <span className="text-cyan-800 font-bold text-sm md:text-xl">{treeNodeTitle || ""}</span>
      </div>

      {/* Logout Icon */}
      <div className="flex" onClick={handleLogout}>
        <PowerSettingsNewIcon className="text-gray-400 hover:cursor-pointer" />
      </div>
    </Toolbar>
  );
};

export default ToolBar;
