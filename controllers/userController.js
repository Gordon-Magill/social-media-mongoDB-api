const User = require("../models/User");
const Thought = require("../models/Thought");
const { deleteThoughtById } = require("./thoughtController");

// Determine of one or many users should be retrieved from a GET request
function userRetrieval(req, res) {
  console.log("userRetrieval called...");
  // If the request body has keys, assume it's a userId
  if (Object.keys(req.body).length == 0) {
    console.log("Empty request body, getting all Users");
    // With no userId to go off of, get all Users
    getAllUsers(req, res);
  } else {
    console.log("Request body found, getting one User");
    // Use the (assumed) userId in the request body to get a single User
    getUserById(req, res);
  }
}

// Get ALL users
function getAllUsers(req, res) {
  console.log("getAllUsers called...");
  // Get all Users (no Id's specified)
  User.find()
    .select("-__v")
    .then((users) => {
      // If no users were found, alert the user, otherwise return the found Users
      users.length === 0
        ? res.status(404).json({ message: "There are no Users!" })
        : res.status(200).json(users);
    })
    // Handle any errors from the db queries
    .catch((err) => res.status(500).json(err));
}

// Create a new user
function createUser(req, res) {
  console.log("createUser called...");
  // Get the user info from the req.body
  User.create(req.body)
    .then((newData) => res.status(200).json(newData))
    .catch((err) => res.status(500).json(err));
}

// Get a single user based on its ID
function getUserById(req, res) {
  console.log("getUserById called...");
  // Get id from req.body, NOT req.params
  User.findById(req.body.userId)
    .select("-__v")
    // Populate all virtuals
    .populate("thoughts")
    .populate("friends")
    .then((user) => {
      // Check for a bad userId, otherwise return the User
      !user
        ? res
            .status(404)
            .json({ message: `No user with ID ${req.body.userId}` })
        : res.status(200).json(user);
    })
    // Handle any errors from db queries
    .catch((err) => res.status(500).json(err));
}

// Update a User with new info
function updateUserById(req, res) {
  console.log("updateUserById called...");
  User.findByIdAndUpdate(
    // Get User to update from req.body
    req.body.userId,
    {
      // Set properties by unpacking the request body
      $set: req.body,
    },
    {
      runValidators: true,
      new: true,
    }
  )
    .select("-__v")
    .then((updatedUser) => {
      // Check for a bad userId, otherwise return the updated User
      !updatedUser
        ? res.status(404).json({ message: "No User with that ID" })
        : res.status(200).json(updatedUser);
    })
    // Handle any errors from the above db queries
    .catch((err) => res.status(500).json(err));
}

// Helper function to delete a Thought based solely on provided Id's
// Used for deleting Thoughts when a User is deleted
function simpleThoughtDelete(thoughtId) {
  console.log("Deleting Thought:", thoughtId, "...");
  // Actually remove the thought
  Thought.findByIdAndRemove(thoughtId).then(() => {
    console.log(`Thought ID ${thoughtId} deleted...`);
  });
}

// Delete a user by its Id
function deleteUserById(req, res) {
  console.log("deleteUserById called...");
  // Use id in req.body, NOT in req.params
  User.findByIdAndRemove(req.body.userId)
    .select("-__v")
    .then((deletedUser) => {
      if (!deletedUser) {
        // If no user was deleted, alert the user
        res.status(404).json({ message: "No user with that ID." });
      } else {
        // If a user was deleted, see if it had Thoughts associated with it
        if (deletedUser.thoughts.length > 0) {
          // If a User did have Thoughts, iteratively delete all of them
          deletedUser.thoughts.forEach((thoughtId) => {
            simpleThoughtDelete(thoughtId)
          });
        }
        res.status(200).json(deletedUser);
      }
    })
    // Hand any errors from the above db queries
    .catch((err) => res.status(500).json(err));
}

// Add a friend to a user
function addFriendById(req, res) {
  console.log("addFriendById called...");
  User.findByIdAndUpdate(
    // Get friending User from req.params
    req.params.userId,
    {
      $addToSet: {
        // Also get friendedUser from separate req.params
        friends: req.params.friendId,
      },
    },
    {
      new: true,
    }
  )
    .select("-__v")
    .then((updatedUser) => {
      // Check for an invalid userId, otherwise return the now more friendly User
      !updatedUser
        ? res.status(404).json({ message: "No user with that ID" })
        : res.status(200).json(updatedUser);
    })
    // Handle any errors from the above db queries
    .catch((err) => res.status(500).json(err));
}

// Remove a friend from a User
function deleteFriendById(req, res) {
  console.log("deleteFriendById called...");
  // console.log(req.params);
  User.findByIdAndUpdate(
    // Get User who is doing the de-friending from req.params
    req.params.userId,
    {
      $pull: {
        // Get the User that is being de-friended from separate req.params
        friends: req.params.friendId,
      },
    },
    { new: true, runValidators: true }
  )
    .select("-__v")
    // .populate("friends")
    .then((updatedUser) => {
      // Check for an invalid userId, otherwise return the now more lonely User
      !updatedUser
        ? res.status(400).json({ message: "No user with that ID" })
        : res.status(200).json(updatedUser);
    })
    // Handle any errors from the db queries
    .catch((err) => res.status(500).json(err));
}

// Export functions for use in routes
module.exports = {
  userRetrieval,
  createUser,
  updateUserById,
  deleteUserById,
  addFriendById,
  deleteFriendById,
};
