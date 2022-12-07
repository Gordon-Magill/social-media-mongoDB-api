const User = require("../models/User");
const Thought = require("../models/Thought");

function userRetrieval(req, res) {
  console.log("userRetrieval called...");
  // console.log(req.body)
  // console.log(Object.keys(req.body).length)
  if (Object.keys(req.body).length == 0) {
    console.log("Empty request body, getting all Users");
    getAllUsers(req, res);
  } else {
    console.log("Request body found, getting one User");
    getUserById(req, res);
  }
}

function getAllUsers(req, res) {
  console.log("getAllUsers called...");
  User.find()
    .select("-__v")
    .then((users) => {
      // console.log(users)
      users.length === 0
        ? res.status(404).json({ message: "There are no Users!" })
        : res.status(200).json(users);
    })
    .catch((err) => res.status(500).json(err));
}

function createUser(req, res) {
  console.log("createUser called...");
  User.create(req.body)
    .then((newData) => res.status(200).json(newData))
    .catch((err) => res.status(500).json(err));
}

function getUserById(req, res) {
  console.log("getUserById called...");
  // console.log(req.body.userId);
  User.findById(req.body.userId)
    .select("-__v")
    .populate("thoughts")
    .populate("friends")
    .then((user) => {
      // console.log(user)
      !user
        ? res
            .status(404)
            .json({ message: `No user with ID ${req.body.userId}` })
        : res.status(200).json(user);
    })
    .catch((err) => res.status(500).json(err));
}

function updateUserById(req, res) {
  console.log("updateUserById called...");
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $set: req.body,
    },
    {
      runValidators: true,
      new: true,
    }
  )
    .select("-__v")
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(500).json(err));
}

function deleteUserById(req, res) {
  console.log("deleteUserById called...");
  User.findByIdAndRemove(req.body.userId)
    .select("-__v")
    .then((deletedUser) => {
      // If the deleted user had thoughts, iteratively delete each Thought
      console.log("Deleted user data: ", JSON.stringify(deletedUser));
      if (deletedUser.thoughts.length > 0) {
        deletedUser.thoughts.forEach((thoughtId) => {
          console.log('Deleting Thought:', thoughtId,'...')
          Thought.findByIdAndRemove(thoughtId)
            .then(deletedThought => {
              console.log(`Thought ID ${thoughtId} deleted...`)
            });
        });
      }
      res.status(200).json(deletedUser);
    })
    .catch((err) => res.status(500).json(err));
}

function addFriendById(req, res) {
  console.log("addFriendById called...");
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $addToSet: {
        friends: req.params.friendId,
      },
    },
    {
      new: true,
    }
  )
    .select("-__v")
    // .populate("friends")
    .then((updatedUser) => {
      !updatedUser
        ? res.status(404).json({ message: "No user with that ID" })
        : res.status(200).json(updatedUser);
    })
    .catch((err) => res.status(500).json(err));
}

//
function deleteFriendById(req, res) {
  console.log("deleteFriendById called...");
  // console.log(req.params);
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $pull: {
        friends: req.params.friendId,
      },
    },
    { new: true, runValidators: true }
  )
    .select("-__v")
    // .populate("friends")
    .then((updatedUser) => {
      !updatedUser
        ? res.status(400).json({ message: "No user with that ID" })
        : res.status(200).json(updatedUser);
    })
    .catch((err) => res.status(500).json(err));
}

module.exports = {
  userRetrieval,
  createUser,
  updateUserById,
  deleteUserById,
  addFriendById,
  deleteFriendById,
};
