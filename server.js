require(`dotenv`).config()
const socket = require(`socket.io`)
app = require(`./app`)
const mongoose = require(`mongoose`)

const port = process.env.PORT || 4500



mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log(`Database connected`)
})
.catch((err) => {
    console.log(err)})


app.listen (port, () => {
console.log(`app is listening on port ${port}!`)
})




