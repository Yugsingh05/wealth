"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";

const CreateAccountDrawer = ({ children }) => {
  const validationSchema = Yup.object({
    name: Yup.string().min(1, "Name is required").required("Name is required"),
    type: Yup.string().required("Account type is required"),
    balance: Yup.string().min(1, "Initial balance is required").required("Initial balance is required"),
    isDefault: Yup.boolean().default(false),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
    validationSchema,  // ✅ Corrected this
    onSubmit: (values) => {
      console.log("values", values);
    },
  });

  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Account Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Account Name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              {formik.errors.name && formik.touched.name && (
                <p className="text-red-600 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Account Type
              </label>
              <Select
                id="type"
                name="type"
                value={formik.values.type}
                onValueChange={(value) => formik.setFieldValue("type", value)} // ✅ Fixed Select handling
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="CURRENT">Current</SelectItem>
                  <SelectItem value="SAVINGS">Savings</SelectItem>
                </SelectContent>
              </Select>

              {formik.errors.type && formik.touched.type && (
                <p className="text-red-600 text-sm">{formik.errors.type}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Initial Balance
              </label>
              <Input
                id="balance"
                name="balance"
                placeholder="0.00"
                value={formik.values.balance}
                onChange={formik.handleChange}
              />
              {formik.errors.balance && formik.touched.balance && (
                <p className="text-red-600 text-sm">{formik.errors.balance}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="isDefault"
                className="text-sm font-medium cursor-pointer"
              >
                Set as Default
              </label>

              <p className="text-sm text-muted-foreground">
                This account will be selected by default for transactions
              </p>

              <Switch
                className="cursor-pointer"
                id="isDefault"
                name="isDefault"
                checked={formik.values.isDefault}
                onCheckedChange={(e) =>
                  formik.setFieldValue("isDefault", e)
                } // ✅ Fixed Switch handling
              />

              {formik.errors.isDefault && formik.touched.isDefault && (
                <p className="text-red-600 text-sm">{formik.errors.isDefault}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                className="cursor-pointer flex-1"
                type="submit" // ✅ Corrected submit handling
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
