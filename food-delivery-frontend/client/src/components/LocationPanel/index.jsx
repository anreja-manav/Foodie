import React, {useContext} from 'react'
import { MyContext } from '../../App';
import TextField from '@mui/material/TextField';

const LocationPanel = () => {
    const context = useContext(MyContext);

    const onChangeInput = (e) => {
        const { name, value } = e.target;
        
        
        context?.setFormFields((prevFields) => ({
            ...prevFields,
            [name]: value
        }));
    };
    

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault();
        context?.toggleLocationPanel(false);
        
        }
    };


    return (
        <div className="w-full h-full py-7 px-4 overflow-y-auto">
            <div className='form-group w-full'>
                <TextField
                    type="search"
                    id="city"
                    name="city"
                    value={context?.formFields.city || ""}
                    label="Enter Your city"
                    variant="outlined"
                    fullWidth
                    onChange={onChangeInput}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
    );
};

export default LocationPanel
