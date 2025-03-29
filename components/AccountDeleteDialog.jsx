"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

const AccountDeleteDialog = ({ handleDeleteAccount ,isDefault = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} className="bg-red-600 hover:bg-red-500 p-2 rounded hover:cursor-pointer">
          <Trash className="text-white h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col items-center gap-4">
        <DialogTitle>Are you sure?</DialogTitle>
        <p className="text-sm text-muted-foreground">
          You want to delete this account?
        {"    "}
          {isDefault  && " You need to atleast 1 default account "}
        </p>

        <div className="flex justify-between mt-4 w-full px-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} className={"hover:cursor-pointer"}>
            Cancel
          </Button>

          <Button
          disabled={isDefault}
            onClick={() => {
              handleDeleteAccount();
              setIsOpen(false);
            }}
            className="bg-red-600 text-white hover:cursor-pointer hover:bg-red-500"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDeleteDialog;