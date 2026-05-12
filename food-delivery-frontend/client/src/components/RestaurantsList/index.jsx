import React, {useContext} from 'react'
import { MyContext } from '../../App'
import { Link } from 'react-router-dom';


const RestaurantsList = () => {

    const context = useContext(MyContext);
    const imgUrl = import.meta.env.VITE_API_URL;


    return (
        <section className='restaurantsSlider py-5'>
            <div className='container mx-auto px-4'>
                {context?.restaurants?.length > 0 ? (
                    <>
                        <h2 className="font-bold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[28px] text-black mt-4 px-4 py-3 pb-10">
                            Restaurants with online food delivery in {context?.formFields?.city}
                        </h2>

                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4'>
                            {context.restaurants.map((restaurant) => (
                                <div 
                                    key={restaurant.id} 
                                    className="rounded-md overflow-hidden flex flex-col h-full transform transition duration-300 hover:scale-95"
                                >
                                    <div className='group imgWrapper overflow-hidden rounded-md relative'>
                                        <Link to={`/restaurants/${restaurant.id}`}>
                                            <div className='img h-48 sm:h-52 overflow-hidden rounded-2xl'>
                                                <img 
                                                    src={`${imgUrl}${restaurant.resturant_pic}`} 
                                                    alt={restaurant.restaurant_name} 
                                                    className='w-full h-full object-cover' 
                                                />
                                            </div>
                                        </Link>
                                    </div>
                                    
                                    <div className="info mt-3">
                                        <h3 className='font-bold text-xl'>{restaurant.restaurant_name}</h3>
                                        <p className="font-medium text-gray-700 text-base">
                                            {restaurant.restaurant_description?.length > 30 
                                                ? `${restaurant.restaurant_description.slice(0, 30)}...` 
                                                : restaurant.restaurant_description}
                                        </p>
                                        <p className="text-gray-500 text-sm">{restaurant.restaurant_address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className='flex flex-col items-center justify-center py-10'>
                        <img src="EmptyRestaurant.png" className='w-64 mb-4' alt="Empty" />
                        <h2 className='text-center font-bold text-black text-2xl'>
                            No restaurants available in your city yet.
                        </h2>
                        <p className='text-center text-gray-600 text-lg max-w-md'>
                            We're working on adding amazing restaurants to your area. Please check back soon!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}

export default RestaurantsList
