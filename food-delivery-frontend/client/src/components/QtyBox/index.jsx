import React, {useState, useContext, useEffect} from 'react';
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { deleteData, editData } from '../../utils/api';
import { Button } from '@mui/material';
import { MyContext } from '../../App';

const QtyBox = (props) => {

    useEffect(() => {
        setQuantity(props.quantity);
    }, [props.quantity]);

    const [quantity, setQuantity] = useState(props?.quantity);
    const context = useContext(MyContext);

    const minusQty = async () => {
        if (quantity === 1) {
            const res = await deleteData(`/cart/remove_item/${props.id}`);

            if (res?.error === false) {
                context.alertBox("success", res.message);
                context.getCartItems();
                return;
            }

            context.alertBox("error", res.message);
            return;
        }
        const newQty = quantity - 1;
        setQuantity(newQty);
        const cartObj ={
            product: props.id,
            quantity: newQty,
        }
        const res = await editData("/cart/update_item", cartObj);
        
        if (res?.error === false) {
            context?.alertBox("success", res?.message);
            context?.getCartItems();
        } else {
            context?.alertBox("error", res?.message);
        }
    };

    const addQty = async () => {
        const newQty = quantity + 1;
        setQuantity(newQty);
        const cartObj ={
            product: props.id,
            quantity: newQty,
        }
        const res = await editData("/cart/update_item", cartObj);
        
        if (res?.error === false) {
            context?.alertBox("success", res?.message);
            context?.getCartItems();
        } else {
            context?.alertBox("error", res?.message);
        }
    };
    
    return (
        <div className="flex items-center justify-between w-full max-w-[170px] sm:max-w-[190px] md:max-w-[210px] border rounded-full overflow-hidden mx-auto">
            <Button className="!min-w-[35px] !w-[35px] !h-[35px] !bg-gray-100 !rounded-none" onClick={minusQty}>
                <FaMinus className="text-[12px]" />
            </Button>

            <span className="flex-1 text-center font-semibold text-[14px]">
                {quantity}
            </span>

            <Button className="!min-w-[35px] !w-[35px] !h-[35px] !bg-orange-500 !rounded-none" onClick={addQty}>
                <FaPlus className="text-white text-[12px]" />
            </Button>
        </div>
    );
}

export default QtyBox
