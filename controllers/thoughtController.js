const Thought = require('../models/Thought')

function getAllThoughts(req,res){
    Thought.find()
        .then(thoughts => res.status(200).json(thoughts))
        .catch(err => res.status(500).json(err));
};

function createThought(req,res){
    Thought.create(req.body)
        .then(newData => res.status(200).json(newData))
        .catch(err => res.status(500).json(err))
};

function getThoughtById(req,res){
    Thought.findOne({_id: req.params.toughtId})
        .select('-__v')
        .populate('reactions')
        .then((thought) => {
            !thought
                ? res.status(404).json({message:'No thought with that ID'})
                : res.status(200).json(thought)
        })
        .catch(err => res.status(500).json(err))
};

// function updateThoughtById(req,res){
//     return null
// }

function deleteThoughtById(req,res){
    Thought.findOneAndDelete({_id: req.params.thoughtId},
        (err, data) => {
            if (data) {
                res.status(200).json(data)
            } else {
                res.status(500).json({message: `Error deleting thought ${req.params.thoughtId}`})
            }
        })
}

module.exports = {
    getAllThoughts,
    createThought,
    getThoughtById,
    // updateThoughtById,
    deleteThoughtById
}