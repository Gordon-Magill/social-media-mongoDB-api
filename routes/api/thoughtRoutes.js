const router = require("express").Router();
const {
  getAllThoughts,
  createThought,
  getThoughtById,
  updateThoughtById,
  deleteThoughtById,
  addReactionById,
  deleteReactionById,
} = require("../../controllers/thoughtController.js");

router.route("/").get(getAllThoughts).post(createThought);

router
  .route("/:thoughtId")
  .get(getThoughtById)
  .put(updateThoughtById)
  .delete(deleteThoughtById);

router
  .route('/:thoughtId/reactions')
  .post(addReactionById)
  .delete(deleteReactionById)

module.exports = router;
