import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'

export const DeleteDialog = ({title , open = true,setOpen,transaction,deleteFn , isBulkDelete = false , selectedIds , loading}) => {
  return (
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger >{title}</DialogTrigger>
   <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
      </DialogDescription>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" className={"cursor-pointer"} onClick={() => setOpen(false)}>Cancel</Button>
        <Button
        disabled={loading}
        className={"cursor-pointer dark:bg-red-600"}
          variant="destructive"
          onClick={() =>{
          isBulkDelete ? deleteFn(selectedIds) :  deleteFn([transaction.id]);
            setOpen(false);
          }}
        >
          Confirm
        </Button>
      </div>
    </DialogHeader>
  </DialogContent>
</Dialog>

  )
}
