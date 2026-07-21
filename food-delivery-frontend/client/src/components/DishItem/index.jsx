import React, {useContext} from 'react'
import { MyContext } from '../../App';
import { Button } from '@mui/material';
import QtyBox from '../QtyBox';


const DishItem = (props) => {
    const context = useContext(MyContext);
    const imgUrl = import.meta.env.VITE_API_URL;
    const item = props?.item;
    const cartItem = context.cartData?.find(
        cart => cart.dish.id === item.id
    );

    const quantity = cartItem?.quantity || 0;

    return (
        <div className='flex items-center justify-between gap-4 w-full'>
            <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                item.food_type === 'VEG' ? 'border-green-600' : 'border-red-600'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                item.food_type === 'VEG' ? 'bg-green-600' : 'bg-red-600'
                }`} />
            </div>
            <div className="flex-1">
                <div className="font-semibold text-[15px] text-black">
                {item.name}
                </div>
                {item.price != null && (
                <div className="flex items-center gap-2 mt-0.5">
                    {item.old_price && (
                    <span className="text-gray-400 line-through text-sm font-medium">
                        ₹{item.old_price}
                    </span>
                    )}
                    <span className="bg-indigo-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                    ₹{item.price}
                    </span>
                </div>
                )}
                {item.description && (
                <div className="text-gray-400 text-xs mt-1 line-clamp-2">
                    {item.description}
                </div>
                )}
            </div>
            <div className="relative self-center ">
                {item.image && (
                <img
                    src={`${imgUrl}${item.image}`}
                    alt={item.name}
                    className="w-30 h-30 rounded-lg object-cover shrink-0 cursor-pointer"
                    onClick={() => context.handleOpenDishDetailsModal(true, item)}
                />
                )}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 shadow-md bg-white rounded-xl border border-gray-200 text-center flex flex-col overflow-hidden">
                {
                    quantity === 0 ? (
                        <Button
                            className="text-emerald-600 font-extrabold text-sm py-1.5 hover:bg-emerald-50 transition-colors tracking-wide"
                            onClick={() => context?.addToCart(item.id, 1)}
                        >
                            ADD
                        </Button>
                    ) : (
                        <QtyBox
                            quantity={quantity}
                            id={item.id}
                        />
                    )
                }
                
                
                </div>
            </div>
        </div>
    )
}

export default DishItem;