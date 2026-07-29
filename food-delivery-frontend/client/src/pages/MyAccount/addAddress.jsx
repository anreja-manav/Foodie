import React, { useState, useEffect, useContext } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

import { MyContext } from "../../App";
import { editData, fetchDataFromApi, postData } from "../../utils/api";

const AddAddress = () => {
    const context = useContext(MyContext);

    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [address_type, setAddressType] = useState("");

    const [formFields, setFormFields] = useState({
        address: "",
        city: "",
        state: "",
        pincode: "",
        contact_number: "",
        is_default: false,
        address_type: "",
    });

    useEffect(() => {
        if (context?.userData?.ID) {
            setFormFields((prev) => ({
                ...prev,
                userId: context.userData.ID,
            }));
        }
    }, [context?.userData?.ID]);

    useEffect(() => {
        if (
            context?.addressMode === "edit" &&
            context?.addressId &&
            context?.userData?.ID
        ) {
            fetchAddress(context.addressId);
        }
    }, [context?.addressMode, context?.addressId]);

    const fetchAddress = (id) => {
        fetchDataFromApi(`/accounts/customer/profile/address/${id}/`).then((res) => {
            if (!res?.data) return;

            setFormFields({
            address_type: res.data.address_type || "",
            address: res.data.address || "",
            city: res.data.city || "",
            state: res.data.state || "",
            pincode: res.data.pincode || "",
            contact_number: res.data.contact_number || "",
            is_default: res.data.is_default || false,
            });

            const mobile = res.data.contact_number || "";
            setPhone(mobile ? `+91${mobile}` : "");
        });
    };

    const onChangeInput = (e) => {
        const { name, value } = e.target;

        setFormFields((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeAddressType = (e) => {
        const value = e.target.value;
        setAddressType(value);
        setFormFields((prev) => ({ ...prev, address_type: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formFields.address_type)
            return context.alertBox("error", "Address Type is required");
        if (!formFields.address)
            return context.alertBox("error", "Address is required");

        if (!formFields.city)
            return context.alertBox("error", "City is required");
        if (!formFields.state)
            return context.alertBox("error", "State is required");
        if (!formFields.pincode)
            return context.alertBox("error", "Pincode is required");

        if (!formFields.contact_number)
            return context.alertBox("error", "Contact number is required");

        setIsLoading(true);

        try {
            let res;

            if (context.addressMode === "add") {
            res = await postData(
                "/accounts/customer/profile/address/add",
                formFields
            );
            } else {
            res = await editData(
                `/accounts/customer/profile/address/update/${context.addressId}/`,
                formFields
            );
            }

            if (!res.error) {
            context.alertBox(
                "success",
                res.message || "Address saved successfully."
            );

            context.toggleAddressPanel(false);
            context.getUserDetails();
            } else {
            context.alertBox(
                "error",
                res.message || "Something went wrong."
            );
            }
        } catch (error) {

            const errors = error.response?.data?.message;

            let message = "Something went wrong.";

            if (errors && typeof errors === "object") {
            const firstKey = Object.keys(errors)[0];
            message = errors[firstKey][0];
            }

            context.alertBox("error", message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <form className="p-8 py-3 pb-8 px-4" onSubmit={handleSubmit}>
        <Stack spacing={2}>
            {/* Address Type */}
            <FormControl>
                <FormLabel>Address Type</FormLabel>
                <RadioGroup
                row
                value={address_type}
                onChange={handleChangeAddressType}
                >
                <FormControlLabel value="home" control={<Radio />} label="Home" />
                <FormControlLabel value="office" control={<Radio />} label="Office" />
                </RadioGroup>
            </FormControl>


            <TextField
            fullWidth
            label="Address"
            size="small"
            name="address"
            value={formFields.address}
            onChange={onChangeInput}
            />

            <TextField
            fullWidth
            label="City"
            size="small"
            name="city"
            value={formFields.city}
            onChange={onChangeInput}
            />

            <TextField
            fullWidth
            label="State"
            size="small"
            name="state"
            value={formFields.state}
            onChange={onChangeInput}
            />

            <TextField
            fullWidth
            label="Pincode"
            size="small"
            name="pincode"
            value={formFields.pincode}
            onChange={onChangeInput}
            />

            <PhoneInput
                defaultCountry="in"
                value={phone}
                onChange={(value) => {
                    setPhone(value);
                    const mobile = value.replace(/\D/g, "").slice(-10);

                    setFormFields((prev) => ({
                    ...prev,
                    contact_number: mobile,
                    }));
                }}
            />

            <FormControlLabel
            control={
                <Switch
                checked={formFields.is_default}
                onChange={(e) =>
                    setFormFields((prev) => ({
                    ...prev,
                    is_default: e.target.checked,
                    }))
                }
                />
            }
            label="Set as Default Address"
            />

            <Button
            type="submit"
            className="btn-org btn-lg w-full"
            disabled={isLoading}
            >
            {isLoading ? (
                <CircularProgress size={20} color="inherit" />
            ) : context.addressMode === "edit" ? (
                "Update Address"
            ) : (
                "Save Address"
            )}
            </Button>

        </Stack>
    </form>
);
};

export default AddAddress;
