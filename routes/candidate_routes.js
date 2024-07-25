const express = require(`express`)
const { addCandidate, allcandidates, getCandidate, getCandidatebyId, updateCandidate, updateCandidateById, deleteCandidate, updatePicture } = require("../controllers/candidate_controllers")

const candidateRoutes = express.Router()

const checkJwt = require(`../middleware/jwt`)
const checkAdmin = require(`../middleware/jwt2`)

const multer = require(`multer`)


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `uploads`)
    },
    filename: function(req, file, cb){
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === `image/jpeg`|| file.mimetype === `image/png` || file.mimetype === `image/jpg` ) {
        cb(null, true)  
    } else{
        cb(new Error(`invalid image type`), false)}
    
}

const upload = multer({storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter

})


candidateRoutes.post(`/create`, upload.single(`picture`), checkAdmin, addCandidate)

candidateRoutes.get(`/all`, checkJwt, allcandidates)

candidateRoutes.get(`/:name`, checkJwt, getCandidate)

candidateRoutes.get(`/get/:id`, checkJwt, getCandidatebyId)

candidateRoutes.put(`/update/:name`, checkAdmin, updateCandidate)

candidateRoutes.put(`/update/picture/:id`,upload.single(`picture`), checkAdmin, updatePicture)

candidateRoutes.delete(`/delete/:id`,checkAdmin, deleteCandidate)

candidateRoutes.put(`/update/byid/:id`, checkAdmin, updateCandidateById)



module.exports = candidateRoutes