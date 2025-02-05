const express = require('express');
const mongoose=require("mongoose")
const { resolve } = require('path');
require("dotenv").config()

const UserModel=require("./schema")


const app = express();
app.use(express.json())
app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});



let connection= mongoose.connect(process.env.mongoURL)
  .then(()=> console.log("mongodb connected"))
  .catch(() => console.error("MongoDB connection error:", err))


app.put('/menu/:id', async (req, res) =>{
  const {name,description,price}=req.body
  payload={name,description,price}

  try {
    const updatedItem=await UserModel.findByIdAndUpdate(req.params.id,payload,{new:true})

    if(!updatedItem){
      return res.status(404).send('Menu item not found');
    }
  } catch (error) {
    res.status(400).send('Error updating menu item');
  }
})


app.delete('/menu/:id', async (req, res) =>{
  try {
    const deletedItem = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).send('Menu item not found');
        }
        res.send('Menu item deleted successfully');
  } catch (error) {
    res.status(400).send('Error deleting menu item');

  }
})



  app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`);
  });
  