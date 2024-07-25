const express = require(`express`)
const morgan  = require(`morgan`)
const cors = require(`cors`)
const categoryRoutes = require(`./routes/category_routes`)
const candidateRoutes  = require(`./routes/candidate_routes`)
const userRoutes = require(`./routes/user_routes`)
const voteRoutes = require(`./routes/vote_routes`)

const app = express()

app.use(express.json({extended: true}))
app.use(express.json({urlencoded: true}))
app.use(morgan(`dev`))
app.use(
    cors({
      origin: "*",
      credentials: true,
      allowedHeaders: "*",
    })
);

app.options("*", cors());

app.use(`/uploads`, express.static(`uploads`))

app.use(`/api/v1/categories`, categoryRoutes)
app.use(`/api/v1/candidates`, candidateRoutes)
app.use(`/api/v1/users`, userRoutes)
app.use(`/api/v1/votes`, voteRoutes)



app.use((req, res, next) => {
    res.status(404).send({
        status: false,
        error: `route not found`
    })
}
)
module.exports = app