const mongoose = require('mongoose');

const User = require('../models/user');
const Candidate = require('../models/candidate.js');
const Category = require('../models/category.js');
const Vote = require('../models/voters.js');

exports.castVote = async (req, res, next) => {
    const { candidate, category, Voter } = req.body;

    if (!candidate || !category || !Voter) {
        return res.status(400).json({
            status: false,
            message: "All fields are required"
        });
    }

    try {
        const existingCandidate = await Candidate.findOne({ name: candidate.toLowerCase() });

        if (!existingCandidate) {
            return res.status(404).json({
                status: false,
                message: "Candidate doesn't exist"
            });
        }

        const existingCategory = await Category.findOne({ Position: category.toLowerCase() });

        if (!existingCategory) {
            return res.status(404).json({
                status: false,
                message: "Category doesn't exist"
            });
        }

        const existingUser = await User.findById(Voter).select('name email');

        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: "User Id is invalid"
            });
        }

        const existingVote = await Vote.findOne({
            $or: [
                { candidate: existingCandidate.name },
                { category: existingCategory.Position }
            ],
            Voter: existingUser._id
        });

        if (existingVote) {
            return res.status(409).json({
                status: false,
                message: `User already voted for ${existingCategory.Position}`
            });
        }

        const newVote = new Vote({
            candidate: existingCandidate.name,
            category: existingCategory.Position,
            Voter: existingUser._id
        });

        const savedVote = await newVote.save();

        if (!savedVote) {
            return res.status(404).json({
                status: false,
                message: "Unable to save vote"
            });
        }

        const finalVote = {
            candidate: existingCandidate.name,
            category: existingCategory.Position
        };

        return res.status(200).json({
            status: true,
            message: "Vote created successfully",
            finalVote
        });

    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({
            status: false,
            message: "An internal error occurred"
        });
    }
};


 exports.getvotes = async (req, res, next) => {
    const {Position} = req.params
    if (!Position) {
        return res.status(400).json({
            status: false,
            message: "Category position is required"
        });
    }

    
    try {

        const votes = await Vote.find({category:Position})
        if (!votes || votes.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No votes found"
            });
            
        }

        const votesCount = await Vote.countDocuments({category:Position})

        return res.status(200).json({
            status: true,
            message: `total number of votes: ${votesCount}`,
            votes
            

        });

        
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({
            status: false,
            message: "An internal error occurred"
        });
    }
 }


 exports.getCandidateVote = async (req, res, next) => {
    const {name} = req.params

    if (!name) {
        return res.status(400).json({
            status: false,
            message: "Candidate name is required"
        });
    }

    
    try {
        const candidateName = name.toLowerCase();

        const votes = await Vote.find({candidate:candidateName})
        if (!votes || votes.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No votes found"
            });
            
        }
        const votesCount = await Vote.countDocuments({candidate:name})

        return res.status(200).json({
            status: true,
            message: `total number of votes: ${votesCount}`,
            votes
            

        });

        
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({
            status: false,
            message: "An internal error occurred"
        });
    }
 }

 exports.getvotes = async (req, res, next) => {
    const {Position} = req.params
    if (!Position) {
        return res.status(400).json({
            status: false,
            message: "Category position is required"
        });
    }

    
    try {

        const votes = await Vote.find({category:Position})
        if (!votes || votes.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No votes found"
            });
            
        }

        const votesCount = await Vote.countDocuments({category:Position})

        return res.status(200).json({
            status: true,
            message: `total number of votes: ${votesCount}`,
            votes
            

        });

        
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({
            status: false,
            message: "An internal error occurred"
        });
    }
 }


 exports.allvotes = async (req, res, next) => {
   
    
    try {

        const votes = await Vote.find()
        if (!votes || votes.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No votes found"
            });
            
        }
        const votesCount = await Vote.countDocuments()

        return res.status(200).json({
            status: true,
            message: `total number of votes: ${votesCount}`,
            votes
            

        });

        
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).json({
            status: false,
            message: "An internal error occurred"
        });
    }
 }