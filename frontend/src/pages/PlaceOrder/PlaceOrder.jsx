import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'


const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({...data, [name]: value }));
  }

  const placeOrder = async (event) =>{
    // to not reload webpage on submitting form
    event.preventDefault();

    let orderItems = [];
    food_list.map((item) => {
      // here we are adding all items from the foodlist into the orderItems array
      if(cartItems[item._id]>0){
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    })
    
    // order data
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount()+2,
    }
    let response = await axios.post(url+"/api/order/place", orderData, { headers: {token}});

    if(response.data.success){
      const {session_url} = response.data;
      // send user on this session url;
      window.location.replace(session_url);
    }
    else{
      alert("Error");
    }
  }


  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required onChange={onChangeHandler} name='firstName' value={data.firstName} type="text" placeholder='First Name' />
          <input required onChange={onChangeHandler} name='lastName' value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required onChange={onChangeHandler} name='email' value={data.email} type="email" placeholder='Email Address' />
        <input required onChange={onChangeHandler} name='street' value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required onChange={onChangeHandler} name='city' value={data.city} type="text" placeholder='City' />
          <input required onChange={onChangeHandler} name='state' value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required onChange={onChangeHandler} name='zipcode' value={data.zipcode} type="text" placeholder='ZIP code' />
          <input required onChange={onChangeHandler} name='country' value={data.country} type="text" placeholder='Country' />
        </div>
        <input required onChange={onChangeHandler} name='phone' value={data.phone} type="text" placeholder='Phone' />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 5}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5}</b>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder