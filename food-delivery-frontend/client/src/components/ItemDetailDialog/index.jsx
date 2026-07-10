import React, { useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { Button } from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../App";
import DishDetailsComponent from "../ItemDetails";

const DishDetailsDialog = () => {
  const {
    openDishDetailsModal,
    handleCloseDishDetailsModal
  } = useContext(MyContext);

  const item = openDishDetailsModal?.item;

  return (

    <Dialog
        open={openDishDetailsModal?.open}
        onClose={handleCloseDishDetailsModal}
        maxWidth="sm"
        fullWidth
    >
        <DialogContent className="p-0! relative">
            <Button
                onClick={handleCloseDishDetailsModal}
                className="absolute! top-4 right-4 bg-white! rounded-full! min-w-11.25! w-11.25! h-11.25! z-50"
            >
                <IoCloseSharp className="text-2xl text-black" />
            </Button>

            <DishDetailsComponent item={item}/>
        </DialogContent>
    </Dialog>
  );
};

export default DishDetailsDialog;
