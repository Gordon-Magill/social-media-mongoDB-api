const router = require("express").Router();
const {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../../controllers/userController.js");

router.route("/")
    .get(getAllUsers)
    .post(createUser);

router.route("/:userID")
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

module.exports = router;
