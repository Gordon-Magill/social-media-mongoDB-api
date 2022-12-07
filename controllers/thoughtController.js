const Thought = require("../models/Thought");
const User = require("../models/User");

// From a GET route, determine if one or multiple users should be returned based on the body content
function thoughtRetrieval(req, res) {
  console.log("thoughtRetrieval called...");
  // Determine if the request body has any content
  if (Object.keys(req.body).length == 0) {
    // If the request body has no content, simply get all Thoughts
    console.log("Empty request body, getting all Thoughts");
    getAllThoughts(req, res);
  } else {
    // If the request body has content (currently assumed to be a thoughtId), get a single Thought using that embedded info
    console.log("Request body found, getting one Thought");
    getThoughtById(req, res);
  }
}

// Get all Thoughts
function getAllThoughts(req, res) {
  console.log("getAllThoughts called...");
  // Find all thoughts
  Thought.find()
    .select("-__v") //Clip version property
    .then((thoughts) => {
      // If there are no thoughts, send a special message, otherwise return the found Thoughts
      thoughts.length === 0
        ? res.status(404).json({ message: "There are no Thoughts!" })
        : res.status(200).json(thoughts);
    })
    // Handle any errors from the db query
    .catch((err) => res.status(500).json(err));
}

// Create a new Thought
function createThought(req, res) {
  console.log("createThought called...");
  // Create a new Thought based on the request body
  Thought.create({
    thoughtText: req.body.thoughtText,
    username: req.body.username,
  })
    .then((newThought) => {
      // Update the user assigned to the thought based on the userId
      User.findByIdAndUpdate(
        // Assign the thought based on the userId
        req.body.userId,
        {
          // Adds the id of the associated thought
          $addToSet: { thoughts: newThought },
        },
        {
          new: true,
        }
      )
        .select("-__v")
        .then((updatedUser) => {
          // If the userId was invalid alert the user, otherwise return the modified User
          !updatedUser
            ? res.status(404).json({ message: "No user with that ID" })
            : res.status(200).json(updatedUser);
        });
    })
    // Handle errors from the query
    .catch((err) => res.status(500).json(err));
}

// Get a single Thought based on its ID
function getThoughtById(req, res) {
  console.log("getThoughtById called...");
  // Get the thoughtId from the body
  Thought.findById(req.body.thoughtId)
    .select("-__v")
    .populate("reactions")
    .then((thought) => {
      // If no Thought was retrieved alert the user, otherwise return the found Thought
      !thought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(thought);
    })
    // Handle errors from the query
    .catch((err) => res.status(500).json(err));
}

// Update a single thought with new content
function updateThoughtById(req, res) {
  console.log("updateThoughtById called...");
  Thought.findByIdAndUpdate(
    // Get the thoughtId from the body, not req.params
    req.body.thoughtId,
    {
      // Populate the new data based on the request body
      thoughtText: req.body.thoughtText,
      username: req.body.username,
    },
    { runValidators: true, new: true }
  )
    .select("-__v")
    .populate("reactions")
    .then((updatedThought) => {
      // If no thought was updated alert the user, otherwise return the Thought
      !updatedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(updatedThought);
    })
    .catch((err) => res.status(500).json(err));
}

// Delete a single Thought by its ID
function deleteThoughtById(req, res) {
  console.log("deleteThoughtById called...");
  // Get the ID from req.body
  Thought.findByIdAndRemove(req.body.thoughtId)
    .select("-__v")
    .then((deletedThought) => {
      // Check for a bad Thought ID, but otherwise remove the Thought from the owning User
      !deletedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : User.findOneAndUpdate( 
            //Remove the deleted thought from the User that owned it
            { thoughts: req.body.thoughtId },
            {
              // Actually remove the deleted Thought reference
              $pull: { thoughts: req.body.thoughtId },
            },
            {
              new: true,
            }
          ).then((updatedUser) => {
            // Check for an invalid userId, otherwise reply with the final updated User
            !updatedUser
              ? res.status(404).json({ message: "No user with that ID." })
              : res.status(200).json(updatedUser);
          });
    })
    // Handle any errors from the above queries
    .catch((err) => res.staus(500).json(err));
}

// Add a reaction subdocument to a Thought
function addReactionById(req, res) {
  console.log("addReactionById called...");
  Thought.findByIdAndUpdate(
    // Get the thoughtId from the req.params, NOT req.body
    req.params.thoughtId,
    {
      $addToSet: {
        // Generate a new embedded reaction from the embedded schema
        reactions: {
          // Default values are also populated
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
      // Check for invalid thoughtId, otherwise respond with the updated Thought
      !updatedThought
        ? res.status(404).json({ message: "No thought with that ID." })
        : res.status(200).json(updatedThought);
    })
    // Handle errors from the above db queries
    .catch((err) => res.status(500).json(err));
}

// Delete a reaction from a Thought
function deleteReactionById(req, res) {
  console.log("deleteReactionById called...");
  Thought.findByIdAndUpdate(
    // Get the thoughtId from req.params, NOT req.body
    req.params.thoughtId,
    {
      // Remove the reaction from the parent Thought
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
      // Check for an invalid thoughtId, otherwise return the updated Thought
      !updatedThought
        ? res.status(404).json({ message: "No thought with that Id" })
        : res.status(200).json(updatedThought);
    })
    // Handle any errors from the db queries
    .catch((err) => res.status(500).json(err));
}

// Export functions for use in routes
module.exports = {
  thoughtRetrieval,
  createThought,
  updateThoughtById,
  deleteThoughtById,
  addReactionById,
  deleteReactionById,
};
