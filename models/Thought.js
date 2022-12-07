// Include schema for Reactions as a subdocument to Thought
const { Schema, model, models, Types } = require("mongoose");

// Subdocument schema for a reaction / comment to a Thought / post
const reactionSchema = new Schema(
  {
    // Create an ID since this won't be a top level document
    reactionID: {
      type: Schema.Types.ObjectId,
      default: Types.ObjectId,
    },
    reactionBody: {
      type: String,
      required: [true, "Reaction body text is required!"],
      maxLength: 280,
    },
    username: {
      type: String,
      required: [true, "Reaction username is required!"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (date) => date.toDateString(),
    },
  },
  {
    // Enable virtuals and getters on JSON output
    toJSON: {
      virtuals: true,
      getters: true,
    },
    // Remove the autogenerated ID (we're making our own in reactionID)
    _id: false,
  }
);

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
    reactions: [reactionSchema],
  },
  {
    // Enable virtuals and getters 
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

// Add a virtual parameter to simply count the number of attached reactions
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Initialize the model
const Thought = model("thought", thoughtSchema);

// Export the model for use in controllers
module.exports = Thought;
