import mongoose from "mongoose"

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://itanuragadhikari:245540@cluster0.yei4ihg.mongodb.net/fooddelivery?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log("DB Connected"))
}