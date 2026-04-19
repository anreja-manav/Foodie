import React from "react";
import { MyContext } from "../../App";
import HomeCatSlider from "../../components/HomeCatSlider";



const Home = () => {
    const imgUrl = import.meta.env.VITE_API_URL;
    const context = React.useContext(MyContext);

    return(
        <>  
            <h2 className="font-bold text-2xl text-black mt-1 pl-3">What's on your mind?</h2>
            <HomeCatSlider />
            
        </>
    )
}

export default Home;