const { User }  = require('../models');

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
            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body);
            res.status(200).json(dbUserData);
        } catch (err) {
            res.status(400).json(err);
        }
    },
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate({ _id: req.params.id },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteUser(req, res) {
        try {
            const userThoughts = await User.find

            const user = await User.findOneAndDelete({ _id: req.params.id });
            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async addFriend(req, res) {
        const { userId, friendId } = req.params;
        try { 
            const user = await User.findOneAndUpdate(
                { _id: userId },
                { $addToSet: { friends: friendId } },
                { new: true }
            );
            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }

            const friend = await User.findOne({ _id: friendId });
            if (!friend) {
                res.status(404).json({ message: 'No friend found with this id!' });
                return;
            }
            res.status(200).json(` ${friend.username} added to ${user.username}'s friend list!`);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async deleteFriend(req, res) {
        const { userId, friendId } = req.params;
        try {
            const user = await User.findOneAndUpdate(
                { _id: userId },
                { $pull: { friends: friendId } },
                { new: true }
            );
            if (!user) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
            }

            const friend = await User.findOne({ _id: friendId });
            if (!friend) {
                res.status(404).json({ message: 'No friend found with this id!' });
                return;
            }
            res.status(200).json(` ${friend.username} removed from ${user.username}'s friend list!`);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};

//TODO bonus: remove a user's associated thoughts when deleted. use pre?


