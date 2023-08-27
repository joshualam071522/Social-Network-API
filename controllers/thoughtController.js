const { Thought, User } = require('../models');

module.exports = {
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.status(200).json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getthoughtById({ params }, res) {
        try {
            const thought = await Thought.findById({ _id: params.id })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            if (!thought) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
            }
            res.status(200).json(thought)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Thought created, but no user found with this id!' });
            }

            res.status(200).json(`Thought created: ${thought}`);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }
}
