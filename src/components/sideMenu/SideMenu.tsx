import { useAuthStore } from "../../store/authStore";
import { buildTree } from "./treeUtils";
import { TreeView } from "./TreeView";
import { MenuItem } from "../../types/menu";
import { useGeneralContext } from "../../context/GeneralContext";
import { useEffect, useState } from "react";
import AutoComplete from "../controls/AutoComplete";
import {
  convertToFarsiDigits,
  formatPersianDate,
} from "../../utilities/general";
import { colors } from "../../utilities/color";
import { useLocation } from "react-router-dom";
import { DefaultOptionType } from "../../types/general";
import { DefinitionInvironment } from "../../types/definitionInvironment";
import packageJson from '../../../package.json'

type Props = {
  definitionInvironment: DefinitionInvironment;
}
const SideMenu = ({ definitionInvironment }: Props) => {
  const {
    isMenuOpened,
    setChartId,
    //  , chartId
  } = useGeneralContext();
  //const { definitionInvironment } = useDefinitionInvironment();
  const { authApiResponse } = useAuthStore();

  const userInfo = authApiResponse?.data.result.login;
  const initData = authApiResponse?.data.result.initData;
  const menu: MenuItem[] | undefined = authApiResponse?.data.result.menu;
  const [visible, setVisible] = useState(isMenuOpened);
  const tree = buildTree(menu ?? []);
  const location = useLocation();

  const [search, setSearch] = useState<string>("");
  const [chart, setChart] = useState<{ id: number; title: string } | null>({
    id: initData?.chartId ?? 0,
    title: convertToFarsiDigits(initData?.chartTitle) ?? "",
  });
  // Delay unmounting inner content for smooth transition

  //const location = useLocation();
  useEffect(() => {
    if (isMenuOpened) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => setVisible(false), 300); // match animation duration
      return () => clearTimeout(timeout);
    }
  }, [isMenuOpened]);


  useEffect(() => {
    if (chart?.id !== undefined && chart.id !== 0) {
      setChartId(Number(chart.id));
      console.log(search, "search");
    }
  }, [chart]);


  const formatted = formatPersianDate(
    definitionInvironment.curDay,
    definitionInvironment.curMonth,
    definitionInvironment.curYear
  );

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
        <div className="flex flex-col w-full items-center justify-center">
          {/* User Info */}
          <div
            className={`${colors.cyan} w-full flex items-center justify-center border-b-2 p-2`}
            //onClick={openLogin}
          >
            <label className=" text-white px-3 py-1 rounded">{formatted}</label>
          </div>
          {/* User Info */}
          <div
            className="w-full flex items-center justify-center border-b-2 p-2"
            //onClick={openLogin}
          >
            {userInfo?.nam || "کاربر سیستم"}
          </div>
          {/* سمت */}
          <div className="w-full flex justify-center items-center hover:cursor-pointer">
            <AutoComplete
              options={
                definitionInvironment?.charts !== undefined
                  ? definitionInvironment?.charts.map((b) => ({
                      id: b.id,
                      title: b.name,
                    }))
                  : []
              }
              inputPadding="0 !important"
              value={chart}
              handleChange={(_event, newValue) => {
                return setChart(newValue as DefaultOptionType);
              }}
              setSearch={setSearch}
              desktopfontsize="0.8rem"
              className="w-2/3 pt-4 md:pt-0 md:w-1/5"
              showLabel={false}
              showBorder={false}
              showClearIcon={false}
              textAlign="center"  
              outlinedInputPadding="10px"           
            />
          </div>
        </div>

        {/* Menu Header */}
        <h2
          className={`${colors.cyan} text-lg font-bold text-gray-50 py-2 px-4`}
        >
          منوی نرم افزار
        </h2>
      </div>

      {/* Scrollable Menu Items */}
      <div className="flex-1 overflow-y-auto p-4 text-gray-400">
        <TreeView data={tree} currentPath={location.pathname} />
      </div>

      {/* Logout Icon */}
       <div
        className="flex border-y-2 w-full justify-center p-2"
        onClick={()=> console.log("gfg")}
      >
        <p className="text-gray-400 hover:cursor-pointer">ویرایش {convertToFarsiDigits(packageJson.version)}</p> 
      </div> 
    </aside>
  );
};

export default SideMenu;
