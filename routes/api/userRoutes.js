const router = require("express").Router();
const {
  userRetrieval,
  createUser,
  updateUserById,
  deleteUserById,
  addFriendById,
  deleteFriendById,
} = require("../../controllers/userController.js");

// Handle basic User CRUD operations with all data in req.body
router
  .route("/")
  .get(userRetrieval)
  .post(createUser)
  .put(updateUserById)
  .delete(deleteUserById);

// For friend formation and dissolution, exhcnage data in req.params
router
  .route("/:userId/friends/:friendId")
  .post(addFriendById)
  .delete(deleteFriendById);

module.exports = router;
