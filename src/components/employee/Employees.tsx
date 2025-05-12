import React, { useState } from "react";
import { Employee } from "../../types/employee";
import PageHeader from "../../components/layout/PageHeader"
import PeopleOutlineTwoToneIcon from "@mui/icons-material/PeopleOutlineTwoTone";
import {
  Paper,
  TableBody,
  TableRow,
  TableCell,
  Toolbar,
  InputAdornment,
} from "@mui/material";
import useTable from "../../hooks/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@mui/icons-material";
import { useBrandStore } from "../../store/brandStore";
import type { Brand } from "../../types/brand";



const headCells = [
  { id: "id" as keyof Brand, label: "Brand Id" ,disableSorting: true},
  { id: "text" as keyof Brand, label: "Brand Name" },
];

export default function Employees() {
  const {brands} = useBrandStore()
  const [filterFn, setFilterFn] = useState<{
    fn: (items: Brand[]) => Brand[];
  }>({
    fn: (items) => items,
  });

  const { TblContainer, TblHead, TblPagination, recordsAfterPagingAndSorting } =
    useTable<Brand>(
      brands,
      headCells,
      filterFn
    );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") return items;
        else
          return items.filter((x) =>
            x.text.toLowerCase().includes(target.value.toLowerCase())
          );
      },
    });
  };

  return (
    <>
      {/* <PageHeader
        title="New Employee"
        subTitle="Form design with validation"
        icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
      /> */}
      <Paper className="p-2 m-2">
        {/* <EmployeeForm /> */}
        <Toolbar>
          <Controls.Input
            name="search"
            value=""
            label="Search Brands"
            className="w-3/4"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
          />
        </Toolbar>
        <TblContainer>
          <TblHead />
          <TableBody>
            {recordsAfterPagingAndSorting().map((item:Brand) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.text}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TblContainer>
        <TblPagination />
      </Paper>
    </>
  );
}