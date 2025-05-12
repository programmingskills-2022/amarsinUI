import { Employee } from "../types/employee";
const KEYS = {
  employees: "employees",
  employeeId: "employeeId",
};

export interface Department {
  id: string;
  title: string;
}


export const getDepartmentCollection = (): Department[] => [
  { id: "1", title: "Development" },
  { id: "2", title: "Marketing" },
  { id: "3", title: "Accounting" },
  { id: "4", title: "HR" },
];

export function insertEmployee(data: Employee): void {
  const employees = getAllEmployees();
  data.id = generateEmployeeId();
  employees.push(data);
  localStorage.setItem(KEYS.employees, JSON.stringify(employees));
}

export function generateEmployeeId(): number {
  if (localStorage.getItem(KEYS.employeeId) === null) {
    localStorage.setItem(KEYS.employeeId, "0");
  }
  const id = parseInt(localStorage.getItem(KEYS.employeeId) || "0", 10);
  localStorage.setItem(KEYS.employeeId, (id + 1).toString());
  return id + 1;
}

export function getAllEmployees(): Employee[] {
  if (localStorage.getItem(KEYS.employees) === null) {
    localStorage.setItem(KEYS.employees, JSON.stringify([]));
  }
  return JSON.parse(localStorage.getItem(KEYS.employees) || "[]") as Employee[];
}