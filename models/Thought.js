// Include schema for Reactions as a subdocument to Thought
const { Schema, model, models, Types } = require("mongoose");

const reactionSchema = new Schema({
  reactionID: {
    type: Types.ObjectId,
    default: new Types.ObjectId(),
  },
  reactionBody: {
    type: String,
    require: true,
    maxLength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (date) => date.toDateString(),
  },
});

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
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual("reactionCount").get(function () {
  return reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = { Thought };
