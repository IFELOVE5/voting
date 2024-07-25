const express = require("express")
const { castVote, getvotes, getCandidateVote, allvotes } = require("../controllers/vote_controller")

const checkJwt = require(`../middleware/jwt`)
const checkAdmin = require(`../middleware/jwt2`)

const voteRoutes = express.Router()

voteRoutes.post(`/new`, checkJwt, castVote)

voteRoutes.get(`/:Position`, checkAdmin, getvotes)

voteRoutes.get(`/:name`, checkAdmin, getCandidateVote)

voteRoutes.get(`/all`, checkAdmin, allvotes)


module.exports = voteRoutes