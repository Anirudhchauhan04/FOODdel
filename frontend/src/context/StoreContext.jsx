import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    // for cart item to store its state
    const [cartItems, setCartItems] = useState({})

    const url = "http://localhost:4000"

    const [token, setToken] = useState("")

    const [food_list, setFoodList] = useState([])

    const addToCart = async (itemId) => {

        // if item is not in cart, add it with quantity 1
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        // if item is in cart, increase its quantity by 1
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }

        // integrating it with backend and ADDING the data in database if the token of user is available
        // ! VERY IMPORTANT
        if (token) {
            await axios.post(url+"/api/cart/add", { itemId }, { headers: {token} })
        }
    }

    // for removing item from cart
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))

        // integrating it with backend and REMOVING the data in database if the token of user is available
        // ! VERY IMPORTANT
        if (token) {
            await axios.post(url+"/api/cart/remove", { itemId }, { headers: {token} })
        }
    }

    // useEffect(() => {
    //     console.log(cartItems);
    // },[cartItems])

    const getTotalCartAmount = () => {
        let totalAmount = 0;

        for (let item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item]
            }
        }
        return totalAmount;
    }

    // fetching food list
    const fetchFoodList = async () => {
        const response = await axios.get(url+"/api/food/list");
        setFoodList(response.data.data)
    }

    // ! this functionality is used to store the cart information on the webpage even when the page is reloaded, if token is found it restores that cart information from database
    const loadCartData = async (token) => {
        const response = await axios.post(url+"/api/cart/get" , {} ,{ headers: {token}});
        setCartItems(response.data.cartData);
    }

    useEffect(() => {
        async function loadData(){
            await fetchFoodList()
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }

        // call this function
        loadData();

    },[])

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
