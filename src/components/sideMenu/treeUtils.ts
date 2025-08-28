import { MenuItem } from "../../types/menu";


export function buildTree(menu: MenuItem[]): MenuItem[] {
  const lookup: Record<number, MenuItem> = {};
  const root: MenuItem[] = [];

  menu.forEach(item => (lookup[item.id] = { ...item, children: [] }));

  menu.forEach(item => {
    if (item.pId === 0) {
      root.push(lookup[item.id]);
    } else {
      lookup[item.pId]?.children?.push(lookup[item.id]);
    }
  });

  return root;
}