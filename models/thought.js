const mongoose = require('mongoose');
//* helper function to format date
const formattedDate = require('date-and-time');

//* child schema for thought schema
const reactionSchema = new mongoose.Schema({
    reactionId: {type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId()},
    reactionText: {type: String, required: true, maxlength: 280},
    username: {type: String, required: true},
    //* getter to format timestamp
    createdAt: {type: Date, default: Date.now, get: createdAtVariable => formattedDate.format(createdAtVariable, 'MMM DD, YYYY [at] HH:mm:ss')}
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