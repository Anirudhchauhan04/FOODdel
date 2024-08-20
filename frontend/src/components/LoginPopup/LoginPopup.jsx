import React, { useCallback, useContext, useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {

    const {url, setToken} = useContext(StoreContext)

    const [currState, setCurrState ] = useState("Sign Up")

    const [data, setData] = useState({
        name: '',
        email: '',
        password: ''
    })

    // onchange function that will take data from input field and save in data variable
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data=> ({...data, [name]: value}))
    }

    // login function
    const onLogin = async (event) => {
        //prevent page from reloading on submit
        event.preventDefault();

        // calling api's
        let newUrl = url;
        if(currState === "Login"){
            newUrl += "/api/user/login";
        }else{
            newUrl += "/api/user/register";
        }

        const response = await axios.post(newUrl, data);

        if(response.data.success){
            // new token set
            setToken(response.data.token);

            //storing in local storage
            localStorage.setItem('token', response.data.token);

            setShowLogin(false)
        }
        else{
            alert(response.data.message)
        }

    }

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-title">
                <h2>{currState}</h2>

                {/* clicking on this icon will make showLogin to false and hence close the popup */}
                <img onClick={() => {setShowLogin(false)}} src={assets.cross_icon} alt="" />
            </div>
            <div className="login-popup-inputs">
                {currState==="Login"?<></>:<input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Your Name" required />}
                {/* name='name' onChange={onChangeHandler} value={data.name}  : we are adding this because we want form data to be fetched and value of data to be changed*/}
                <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Your Email" required />
                <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder="Your Password" required />
            </div>
            <button type='submit'>{currState==="Sign Up"?"Create Account":"Login"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required/>
                <p>By continuing, i agree to the terms of use & privacy policy.</p>
            </div>
            {currState === "Login" 
            ? <p>Create a new account? <span onClick={()=> setCurrState("Sign Up")}>Sign Up Here</span></p>
            : <p>Already have an account? <span onClick={()=> setCurrState("Login")} >LoginHere</span></p>}
            
            

        </form>
    </div>
  )
}

export default LoginPopup