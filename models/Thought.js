// Include schema for Reactions as a subdocument to Thought
const { Schema, model, models, Types } = require("mongoose");

// Subdocument schema for a reaction / comment to a Thought / post
const reactionSchema = new Schema({
  // Create an ID since this won't be a top level document
  reactionID: {
    type: Types.ObjectId,
    default: new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    required: [true,"Reaction body text is required!"],
    maxLength: 280,
  },
  username: {
    type: String,
    required: [true,"Reaction username is required!"]
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (date) => date.toDateString(),
  },
},{
  toJSON: {
    virtuals:true
  },
  id:false
});

// Schema for a Thought, effectively a small text post
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: [true, "Thought text is required!"],
      minLength: 1,
      maxLength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => date.toDateString(),
    },
    username: {
      type: String,
      required: [true, "Username for thought is required!"],
    },
    reactions: [ reactionSchema ]
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
