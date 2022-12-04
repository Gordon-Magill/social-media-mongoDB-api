const router = require('express').Router()
const {
    getAllThoughts,
    createThought,
    getThoughtById,
    updateThoughtById,
    deleteThoughtById
} = require('../../controllers/thoughtController.js')

router.route('/')
    .get(getAllThoughts)
    .post(createThought)

router.route('/:toughtId')
    .get(getThoughtById)
    .put(updateThoughtById)
    .delete(deleteThoughtById)

module.exports = router;