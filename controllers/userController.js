const User = require("../models/User");

function getAllUsers(req, res) {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
}

function createUser(req, res) {
  User.create(req.body)
    .then((newData) => res.status(200).json(newData))
    .catch((err) => res.status(500).json(err));
}

function getUserById(req, res) {
  console.log(JSON.stringify(req.params.userId));
  User.findById(req.params.userId)
    .select("-__v")
    .populate("thoughts")
    .populate("friends")
    .then((user) => {
      !user
        ? res
            .status(404)
            .json({ message: `No user with ID ${req.params.userId}` })
        : res.status(200).json(user);
    })
    .catch((err) => res.status(500).json(err));
}

function updateUserById(req, res) {
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $set: req.body,
    },
    {
      runValidators: true,
      new: true,
    }
  )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((err) => res.status(500).json(err));
}

function deleteUserById(req, res) {
  User.findByIdAndDelete(req.params.userId, (err, data) => {
    if (data) {
      res.status(200).json(data);
    } else {
      res
        .status(500)
        .json({ message: `Error deleting user ${req.params.userId}` });
    }
  });
}

function addFriendById(req, res) {
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
    .populate("friends")
    .then((updatedUser) => {
      !updatedUser
        ? res.status(404).json({ message: "No user with that ID" })
        : res.status(200).json(updatedUser);
    })
    .catch((err) => res.status(500).json(err));
}

// 
function deleteFriendById(req, res) {
  console.log(req.params);
  User.findByIdAndUpdate(
    req.params.userId,
    {
      $pull: {
        friends: req.params.friendId,
      },
    },
    { new: true, runValidators: true }
  )
    // .populate("friends")
    .then((updatedUser) => {
      !updatedUser
        ? res.status(400).json({ message: "No user with that ID" })
        : res.status(200).json(updatedUser);
    })
    .catch((err) => res.status(500).json(err));
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  addFriendById,
  deleteFriendById,
};
