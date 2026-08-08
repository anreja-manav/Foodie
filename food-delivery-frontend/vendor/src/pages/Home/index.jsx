import React from "react";
import { MyContext } from "../../App";



const Home = () => {
    const imgUrl = import.meta.env.VITE_API_URL;
    const context = React.useContext(MyContext);

    return(
        <>  
            <h2 className="font-bold text-2xl text-black mt-1 pl-3">Home</h2>
            
        </>
    )
}

export default Home;