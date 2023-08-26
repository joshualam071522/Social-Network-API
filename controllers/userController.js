const User = require('../models/User');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async getUserById({ params }, res) {
        try {
            const user = await User.findById({ _id: params.id })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v');
            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createUser({ body }, res) {
        try {
            const user = await User.create(body);
            res.status(200).json(user);
        } catch (err) {
            res.status(400).json(err);
        }
    }
}
