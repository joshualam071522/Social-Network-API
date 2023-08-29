const { Thought, User } = require('../models');

module.exports = {
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v');

            res.status(200).json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getThoughtById( req , res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
            .populate({
                path: 'reactions',
                select: '-__v'
            })
            .select('-__v');
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
    },
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }

            res.status(200).json(`Thought updated: ${thought}`);

        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }

            res.status(200).json(`Thought deleted: ${thought}`);

        } catch (err) {
            res.status(500).json(err);
        }
    },
    async addReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }

            res.status(200).json(`Reaction added: ${thought}`);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with this id!' });
            }

            res.status(200).json(`Reaction deleted: ${thought}`);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
};