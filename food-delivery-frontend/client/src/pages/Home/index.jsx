import React from "react";
import { MyContext } from "../../App";
import HomeCatSlider from "../../components/HomeCatSlider";
import RestaurantsSlider from "../../components/RestaurantsSlider";
import LocationPanel from "../../components/LocationPanel";
import Drawer from "@mui/material/Drawer";
import { IoCloseSharp } from "react-icons/io5";
import RestaurantsList from "../../components/RestaurantsList";



const Home = () => {
    const imgUrl = import.meta.env.VITE_API_URL;
    const context = React.useContext(MyContext);

    return(
        <>  
            <Drawer
                open={context.openLocationPanel}
                onClose={() => context.toggleLocationPanel(false)}
                anchor="left"
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '400px',
                        boxSizing: 'border-box',
                    },
                }}
            >
                <div className="flex items-center justify-between py-4 px-4 border-b border-[rgba(0,0,0,0.1)]">
                    <IoCloseSharp className="text-[24px] cursor-pointer" onClick={() => context.toggleLocationPanel(false)} />
                    
                </div>
                
                    <LocationPanel/>
                
            </Drawer>
            <h2 className="font-bold text-2xl text-black mt-1 pl-3">What's on your mind?</h2>
            <HomeCatSlider />

            <hr className="m-6"></hr>

            <RestaurantsSlider />
            <RestaurantsList />
            
        </>
    )
}

export default Home;