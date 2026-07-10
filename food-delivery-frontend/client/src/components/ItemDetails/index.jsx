import React from "react";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import { IoCartOutline } from "react-icons/io5";
import { TbHeartHandshake } from "react-icons/tb";
import { IoGitCompareOutline } from "react-icons/io5";
import { MyContext } from "../../App";
import { postData } from "../../utils/api";

const DishDetailsComponent = (props) => {
    const [dishActionIndex, setDishActionIndex] = React.useState(null);
    const [selectedTabName, setSelectedTabName] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [tabError, setTabError] = React.useState(false);

    const context = React.useContext(MyContext);
    const imgUrl = import.meta.env.VITE_API_URL;


    const handleClickActiveTab = (index, name) => {
        setDishActionIndex(index);
        setSelectedTabName(name);
        setTabError(false);
    }

    return (
        <div>

            {/* Image */}
            <div className="h-90">
                <img
                    src={`${imgUrl}${props.item.image}`}
                    alt={props.item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Body */}
            <div className="p-6">

                <div className="flex justify-between items-start">

                    <div>

                        {/* Veg/Non Veg */}
                        <div
                            className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                                props.item.food_type === "VEG"
                                ? "border-green-600"
                                : "border-red-600"
                            }`}
                        >
                            <div
                                className={`w-2 h-2 rounded-full ${
                                    props.item.food_type === "VEG"
                                    ? "bg-green-600"
                                    : "bg-red-600"
                                }`}
                            />
                        </div>

                        <h2 className="text-2xl font-bold mt-2">
                            {props.item.name}
                        </h2>

                        <div className="flex items-center gap-2 mt-0.5">
                            {props.item.old_price && (
                            <span className="text-gray-400 line-through text-sm font-medium">
                                ₹{props.item.old_price}
                            </span>
                            )}
                            <span className="bg-indigo-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                            ₹{props.item.price}
                            </span>
                        </div>

                        <div className="flex items-center mt-3">
                            <Rating
                                value={4.2}
                                precision={0.5}
                                size="small"
                                readOnly
                            />
                            <span className="ml-2 text-green-700 font-semibold">
                                4.2 (11)
                            </span>
                        </div>

                    </div>

                    <Button
                        variant="outlined"
                        color="success"
                        className="font-bold! px-8! py-2! text-emerald-600!"
                    >
                        ADD
                    </Button>

                </div>

                <p className="mt-6 text-gray-600 leading-8">
                    {props.item.description}
                </p>

            </div>

        </div>
    );
}

export default DishDetailsComponent;
