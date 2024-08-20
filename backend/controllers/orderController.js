import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order from frontend
// logic to place order
const placeOrder = async (req, res) => {

    const frontend_url = "http://localhost:5173"

    try {
        // creating new order
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address:req.body.address
        })
        // saving order in database
        await newOrder.save();

        // clear users cart after placing order
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}})

        //creating line items for stripe payment
        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80,
            },
            quantity: item.quantity,
        }))

        // delivery charges in line items
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2*100*80,
            },
            quantity: 1,
        })


        // creating session
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true, session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error placing order"})
    }
}

// verifying order
// it should generally be done using webhooks but right now we are doing it with general verification with the params recieved

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        // if in request body we get the success value to be true we will change the payment to true and make Order to be successful
        if(success == "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true, message:"Order Placed Successfully"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"Order Failed"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error verifying order"})
    }
}

export {placeOrder, verifyOrder}