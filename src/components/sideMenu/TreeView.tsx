import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "../../types/menu";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useGeneralContext } from "../../context/GeneralContext";

interface TreeProps {
  data: MenuItem[];
  level?: number;
}

export const TreeView: React.FC<TreeProps> = ({ data, level = 0 }) => {
  return (
    <ul>
      {data.map((item) => (
        <TreeNode key={item.id} item={item} level={level} />
      ))}
    </ul>
  );
};

interface TreeNodeProps {
  item: MenuItem;
  level: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ item, level }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { setTreeNodeTitle, setIsMenuOpened, isMenuOpened } =
    useGeneralContext();

  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    } else if (item.path) {
      // Close the menu only on mobile screens
      if (window.innerWidth < 640) {
        setIsMenuOpened(false);
      }
      navigate(item.path);
    }
    if (!hasChildren) setTreeNodeTitle(item.name);
  };

  return (
    <li>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer select-none hover:bg-gray-100`}
        style={{ paddingRight: `${level * 16}px` }} // Indent child items
        onClick={handleClick}
      >
        {hasChildren ? (
          <>
            <span>
              {expanded ? (
                <KeyboardArrowDownIcon className="text-gray-400" />
              ) : (
                <KeyboardArrowLeftIcon className="text-gray-400" />
              )}
            </span>
            <TurnedInIcon className="text-gray-400" />
          </>
        ) : (
          <span className="pr-6">
            <ArrowBackIcon className="text-gray-400" />
          </span>
        )}
        <span
          className={(item.children?.length ?? 0) > 0 ? "" : "text-gray-600"}
        >
          {item.name}
        </span>
      </div>
      {hasChildren && expanded && (
        <TreeView data={item.children!} level={level + 1} />
      )}
    </li>
  );
};
