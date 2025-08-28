export interface MenuItem {
    id: number;
    pId: number;
    name: string;
    path: string;
    children?: MenuItem[];
  }