const router = require("express").Router();
const {
  thoughtRetrieval,
  createThought,
  updateThoughtById,
  deleteThoughtById,
  addReactionById,
  deleteReactionById,
} = require("../../controllers/thoughtController.js");

// Handle basic CRUD operations with data in req.body
router
  .route("/")
  .get(thoughtRetrieval)
  .post(createThought)
  .put(updateThoughtById)
  .delete(deleteThoughtById);

// For adding reactions, get the thoughtId in req.params but the reactionId through req.body
router
  .route("/:thoughtId/reactions/")
  .post(addReactionById)
  .delete(deleteReactionById);

module.exports = router;
