const router = require("express").Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  addFriendById,
  deleteFriendById,
} = require("../../controllers/userController.js");

router
  .route("/")
  .get(getAllUsers)
  .get(getUserById)
  .post(createUser)
  .put(updateUserById)
  .delete(deleteUserById);

router
  .route("/:userId/friends/:friendId")
  .post(addFriendById)
  .delete(deleteFriendById);

module.exports = router;
