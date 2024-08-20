import express from 'express'
import { addFood, listFood, removeFood } from '../controllers/foodController.js'

//image storage 
import multer from 'multer' 

//using this method we can create several methods
const foodRouter = express.Router();

// Image storage Engine using Multer
const storage = multer.diskStorage({
    destination:"uploads",
    filename: (req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

//to send data to server
foodRouter.post("/add", upload.single("image") , addFood);
foodRouter.get("/list", listFood)
foodRouter.post("/remove", removeFood)

export default foodRouter;