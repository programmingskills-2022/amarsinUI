import React from "react";
import { Button } from "@mui/material";
import { useForm, Form } from "../../components/useForm";
import Controls from "../controls/Controls";
import * as employeeService from "../../services/employeeService";

const genderItems = [
    { id: 'male', title: 'Male' },
    { id: 'female', title: 'Female' },
    { id: 'other', title: 'Other' },
]

interface EmployeeFormValues {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  gender: string;
  departmentId: string;
  hireDate: Date;
  isPermanent: boolean;
}

const initialFValues: EmployeeFormValues = {
  id: 0,
  fullName: "",
  email: "",
  mobile: "",
  city: "",
  gender: "male",
  departmentId: "",
  hireDate: new Date(),
  isPermanent: false,
};

export default function EmployeeForm() {
  const validate = (fieldValues: Partial<EmployeeFormValues>) => {
    let temp: { [key: string]: string } = { ...errors };
    if ("fullName" in fieldValues)
      temp.fullName = fieldValues.fullName ? "" : "This field is required.";
    if ("email" in fieldValues)
      temp.email = /.+@.+\..+/.test(fieldValues.email || "")
        ? ""
        : "Email is not valid.";
    if ("mobile" in fieldValues)
      temp.mobile =
        fieldValues.mobile && fieldValues.mobile.length > 9
          ? ""
          : "Minimum 10 numbers required.";
    setErrors(temp);

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, errors, setErrors, handleInputChange, resetForm } =
    useForm<EmployeeFormValues>({
      initialFValues,
      validateOnChange: true,
      validate,
    });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate(values)) {
      console.log("Form Submitted", values);
      resetForm();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Controls.Input
        name="fullName"
        label="Full Name"
        value={values.fullName}
        onChange={handleInputChange}
        errorText={errors.fullName}
      />
      <Controls.Input
        label="Email"
        name="email"
        value={values.email}
        onChange={handleInputChange}
        errorText={errors.email}
      />
      <Controls.Input
        label="Mobile"
        name="mobile"
        value={values.mobile}
        onChange={handleInputChange}
        errorText={errors.mobile}
      />
      <Controls.Input
        label="City"
        name="city"
        value={values.city}
        onChange={handleInputChange}
      />

      <Controls.RadioGroup
        name="gender"
        label="Gender"
        value={values.gender}
        onChange={handleInputChange}
        items={genderItems}
      />
       {/*<Controls.Select
        name="departmentId"
        label="Department"
        value={values.departmentId}
        onChange={handleInputChange}
        options={employeeService.getDepartmentCollection()}
        error={errors.departmentId}
      />
      <Controls.DatePicker
        name="hireDate"
        label="Hire Date"
        value={values.hireDate}
        onChange={handleInputChange}
      />
      <Controls.Checkbox
        name="isPermanent"
        label="Permanent Employee"
        value={values.isPermanent}
        onChange={handleInputChange}
      /> */}

      <div>
        <Controls.Button type="submit" text="Submit" />
        <Controls.Button text="Reset" color="warning" onClick={resetForm} />
      </div>
    </Form>
  );
}
