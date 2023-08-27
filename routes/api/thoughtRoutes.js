const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    createThought,
} = require('../../controllers/thoughtController');

router.route('/').get(getAllThoughts).post(createThought);

router.route('/:id').get(getThoughtById);

module.exports = router;