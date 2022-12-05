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

router.route("/").get(getAllUsers).post(createUser);

router
  .route("/:userId")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

router.route("/:userID/friend").post(addFriendById);

router.route("/:userId/friend/:friendId").delete(deleteFriendById);

module.exports = router;
