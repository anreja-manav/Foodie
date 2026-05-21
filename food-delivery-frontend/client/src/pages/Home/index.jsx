import React from "react";
import { MyContext } from "../../App";
import HomeCatSlider from "../../components/HomeCatSlider";
import RestaurantsSlider from "../../components/RestaurantsSlider";
import RestaurantsList from "../../components/RestaurantsList";



const Home = () => {
    const imgUrl = import.meta.env.VITE_API_URL;
    const context = React.useContext(MyContext);

    return(
        <>  
            <h2 className="font-bold text-2xl text-black mt-1 pl-3">What's on your mind?</h2>
            <HomeCatSlider />

            <hr className="m-6"></hr>

            <RestaurantsSlider />
            <RestaurantsList />
            
        </>
    )
}

export default Home;