const Thought = require("../models/Thought");
const User = require("../models/User");

function getAllThoughts(req, res) {
  Thought.find()
    .then((thoughts) => {
      console.log(thoughts)
      res.status(200).json(thoughts)
    })
    .catch((err) => res.status(500).json(err));
}

function createThought(req, res) {
  console.log(req.body);
  Thought.create({
    thoughtText: req.body.thoughtText,
    username: req.body.username
  })
    .then((newThought) => {
      return User.findByIdAndUpdate(
        req.body.userId,
        {
          $addToSet: { thoughts: newThought},
        },
        {
          new: true,
        }
      ).then((updatedUser) => {
        !updatedUser
          ? res.status(404).json({ message: "No user with that ID" })
          : res.status(200).json(updatedUser);
      });
    })
    .catch((err) => res.status(500).json(err));
}

function getThoughtById(req, res) {
  Thought.findById(req.params.thoughtId)
    // .select("-__v")
    // .populate("reactions")
    .then((thought) => {
      try{
        !thought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(thought);
      } catch (err) {
        console.log(err)
      }
      
    })
    .catch((err) => res.status(500).json(err));
}

function updateThoughtById(req, res) {
  Thought.findByIdAndUpdate(
    req.params.thoughtId,{
      thoughtText: req.body.thoughtText,
      username: req.body.username
    },
    { runValidators: true, new: true }
  )
    .select("-__v")
    .populate("reactions")
    .then((updatedThought) => {
      !updatedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(updatedThought);
    })
    .catch((err) => res.status(500).json(err));
}

function deleteThoughtById(req, res) {
  Thought.findByIdAndRemove(req.params.thoughtId)
    .then((deletedThought) => {
      !deletedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            {
              $pull: { thoughts: req.params.thoughtId },
            },
            {
              new: true,
            }
          ).then(updatedUser => {
            !updatedUser
              ? res.status(404).json({message: "No user with that ID."})
              : res.status(200).json(updatedUser)
          });
    })
    .catch((err) => res.staus(500).json(err));
}

function addReactionById(req, res) {
  Thought.findByIdAndUpdate(
    req.params.thoughtId,
    {
      $addToSet: {
        reactions: {
          reactionBody: req.body.reactionBody,
          username: req.body.username,
        },
      },
    },
    { runValidators: true, new: true }
  )
    .select("-__v")
    .populate("reactions")
    .then((updatedThought) => {
      !updatedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(updatedThought);
    })
    .catch((err) => res.status(500).json(err));
}

function deleteReactionById(req, res) {
  Thought.findByIdAndUpdate(
    req.params.thoughtId,
    {
      $pull: {
        reactions: {
          reactionID: req.body.reactionId,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )
    .select("-__v")
    .populate("reactions")
    .then((updatedThought) => {
      !updatedThought
        ? res.status(404).json({ message: "No thought with that Id" })
        : res.status(200).json(updatedThought);
    })
    .catch((err) => res.status(500).json(err));
}

module.exports = {
  getAllThoughts,
  createThought,
  getThoughtById,
  updateThoughtById,
  deleteThoughtById,
  addReactionById,
  deleteReactionById,
};
