const mongoose = require('mongoose');

//* child schema for thought schema
const reactionSchema = new mongoose.Schema({
    reactionId: {type: mongoose.Schema.Types.ObjectId, default: () => new Types.ObjectId()},
    reactionBody: {type: String, required: true, maxlength: 280},
    username: {type: String, required: true},
    //* getter to format timestamp
    createdAt: {type: Date, default: Date.now, get: createdAtVariable => dateFormat(createdAtVariable)}
},
{
    toJSON: {
        getters: true
    },
    id: false
});

const thoughtSchema = new mongoose.Schema({
    thoughtText: {type: String, required: true, minlength: 1, maxlength: 280},
    createdAt: {type: Date, default: Date.now},
    username: {type: String, required: true},
    reactions: [reactionSchema]
},
{
    toJSON: {
        virtuals: true,
    },
    id: false
});

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

const Thought = mongoose.model('Thought', thoughtSchema);

module.exports = Thought;