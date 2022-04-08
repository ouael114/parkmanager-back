const express = require('express')
const dotenv = require('dotenv').config()
const errorHandler = require('./middlewares/errors')
const userRouter = require('./routes/user.routes')
const placeParkingRouter = require('./routes/placeParking.routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/users', userRouter)
app.use('/places', placeParkingRouter)

// Error Handling
app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`server up and running on port : ${PORT}`)
})