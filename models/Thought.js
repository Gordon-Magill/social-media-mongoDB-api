// Include schema for Reactions as a subdocument to Thought
const { Schema, model, models } = require("mongoose");

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
    reactions: [
      {
        reactionID: {
          type: Schema.Types.ObjectId,
          default: new Schema.Types.ObjectId(),
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
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtuals("reactionCount").get(function () {
  return reactions.length;
});

const Thought = model("thought", thoughtSchema);

module.exports = { Thought };
