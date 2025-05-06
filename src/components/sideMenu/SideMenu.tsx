import { useNavigate } from 'react-router-dom';  
import { useAuthStore } from '../../store/authStore';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { buildTree } from './treeUtils';
import { TreeView } from './TreeView';
import { MenuItem } from '../../types/menu';

const SideMenu = () => {  
  const { authApiResponse } = useAuthStore();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInfo = authApiResponse?.data.result.login;  
  const initData = authApiResponse?.data.result.initData;
  const menu: MenuItem[] | undefined = authApiResponse?.data.result.menu;

  const tree = buildTree(menu ?? []);

  return (  
    <aside className="bg-white w-full h-full text-gray-600 text-sm flex flex-col">
      {/* Top Section */}
      <div>
        {/* User Info */}
        <div className="flex items-center justify-center border-y-2 p-2 hover:cursor-pointer">
          {userInfo?.nam || 'کاربر سیستم'}
        </div>
        <div className="flex items-center justify-center p-2 hover:cursor-pointer">
          {initData?.chartTitle || '...'}
        </div>

        {/* Menu Header */}
        <h2 className="text-lg font-bold bg-cyan-600 text-gray-50 py-2 px-4">منوی نرم افزار</h2>
      </div>

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 text-gray-400">
        <TreeView data={tree} />
      </div>

      {/* Logout Icon */}
      <div
        className="flex border-y-2 w-full justify-end p-2"
        onClick={handleLogout}
      >
        <PowerSettingsNewIcon className="text-gray-400 hover:cursor-pointer" />
      </div>
    </aside> 
  );  
};  

export default SideMenu;