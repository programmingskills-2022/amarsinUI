/**
 * Example usage of TableTreeView component with TTable integration
 * 
 * This file demonstrates different ways to use the TableTreeView component.
 * The component now uses your existing TTable component for consistent styling.
 * Delete this file when you're done reviewing the examples.
 */

import { TableTreeView, TableTreeColumn } from "./TableTreeView";

// Example 1: Simple hierarchical data
interface Employee {
  id: number;
  parentId: number | null;
  name: string;
  role: string;
  department: string;
}

const employeeData: Employee[] = [
  { id: 1, parentId: null, name: "John CEO", role: "CEO", department: "Executive" },
  { id: 2, parentId: 1, name: "Jane Manager", role: "Manager", department: "Sales" },
  { id: 3, parentId: 1, name: "Bob Manager", role: "Manager", department: "Tech" },
  { id: 4, parentId: 2, name: "Alice Sales", role: "Sales Rep", department: "Sales" },
  { id: 5, parentId: 2, name: "Charlie Sales", role: "Sales Rep", department: "Sales" },
  { id: 6, parentId: 3, name: "David Dev", role: "Developer", department: "Tech" },
  { id: 7, parentId: 3, name: "Eve Dev", role: "Developer", department: "Tech" },
  { id: 8, parentId: 6, name: "Frank Junior", role: "Junior Dev", department: "Tech" },
];

export function EmployeeTreeExample() {
  const columns: TableTreeColumn<Employee>[] = [
    {
      header: "Name",
      accessor: "name",
      width: "40%",
    },
    {
      header: "Role",
      accessor: "role",
      width: "30%",
    },
    {
      header: "Department",
      accessor: "department",
      width: "30%",
    },
  ];

  return (
    <TableTreeView
      data={employeeData}
      columns={columns}
      defaultExpandedLevel={1} // Auto-expand first level
      onRowClick={(employee) => console.log("Clicked:", employee)}
    />
  );
}

// Example 2: With custom rendering
interface Category {
  id: string;
  parentId: string | null;
  name: string;
  count: number;
  isActive: boolean;
}

const categoryData: Category[] = [
  { id: "1", parentId: null, name: "Electronics", count: 150, isActive: true },
  { id: "2", parentId: "1", name: "Phones", count: 50, isActive: true },
  { id: "3", parentId: "1", name: "Laptops", count: 100, isActive: true },
  { id: "4", parentId: "2", name: "iPhone", count: 25, isActive: true },
  { id: "5", parentId: "2", name: "Android", count: 25, isActive: true },
  { id: "6", parentId: null, name: "Clothing", count: 200, isActive: false },
];

export function CategoryTreeExample() {
  const columns: TableTreeColumn<Category>[] = [
    {
      header: "Category",
      accessor: "name",
      width: "50%",
      render: (item, level) => (
        <span style={{ fontWeight: level === 0 ? "bold" : "normal" }}>
          {item.name}
        </span>
      ),
    },
    {
      header: "Items",
      accessor: "count",
      width: "25%",
      render: (item) => <span style={{ color: "#666" }}>{item.count}</span>,
    },
    {
      header: "Status",
      accessor: "isActive",
      width: "25%",
      render: (item) => (
        <span
          style={{
            color: item.isActive ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  return (
    <TableTreeView
      data={categoryData}
      columns={columns}
      defaultExpandedLevel={2} // Auto-expand two levels deep
    />
  );
}

// Example 3: With string IDs
interface FileSystem {
  id: string;
  parentId?: string;
  name: string;
  type: "folder" | "file";
  size?: string;
}

const fileSystemData: FileSystem[] = [
  { id: "root", parentId: undefined, name: "root", type: "folder" },
  { id: "src", parentId: "root", name: "src", type: "folder" },
  { id: "public", parentId: "root", name: "public", type: "folder" },
  { id: "components", parentId: "src", name: "components", type: "folder" },
  { id: "utils", parentId: "src", name: "utils", type: "folder" },
  { id: "app.tsx", parentId: "src", name: "App.tsx", type: "file", size: "2.5 KB" },
  { id: "button.tsx", parentId: "components", name: "Button.tsx", type: "file", size: "1.2 KB" },
  { id: "table.tsx", parentId: "components", name: "Table.tsx", type: "file", size: "3.8 KB" },
  { id: "helpers.ts", parentId: "utils", name: "helpers.ts", type: "file", size: "0.8 KB" },
];

export function FileSystemTreeExample() {
  const columns: TableTreeColumn<FileSystem>[] = [
    {
      header: "Name",
      accessor: "name",
      width: "60%",
      render: (item) => (
        <span>
          {item.type === "folder" ? "📁" : "📄"} {item.name}
        </span>
      ),
    },
    {
      header: "Type",
      accessor: "type",
      width: "20%",
    },
    {
      header: "Size",
      accessor: "size",
      width: "20%",
      render: (item) => item.size || "-",
    },
  ];

  return (
    <TableTreeView
      data={fileSystemData}
      columns={columns}
      defaultExpandedLevel={3} // Expand all levels
    />
  );
}

