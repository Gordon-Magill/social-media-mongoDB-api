const router = require("express").Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
  addFriendById,
  deleteFriendById
} = require("../../controllers/userController.js");

router.route("/").get(getAllUsers).post(createUser);

router
  .route("/:userID")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

router
  .route("/:userID/friend/:friendID")
  .post(addFriendById)
  .delete(deleteFriendById)

module.exports = router;
