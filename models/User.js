const { Schema, model } = require("mongoose");

// Custom validator to check for valid email address
function emailValidation(email) {
  return /(\w+?)@(\w+?\.(com|org|net|gov|edu))/.test(email);
}

// Schema definition for a basic User
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: true,
      validate: {
        //Using email validation defined above
        validator: emailValidation,
        message: (emailInput) => `${emailInput} is not a valid email!`,
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true, //Enable the use of virtual properties in JSON output
    },
    id: false,
  }
);

// Virtual property that's just the number of this User's friends
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// Create the User model based on the above schema
const User = model("user", userSchema);

// Export User for use in the controllers
module.exports = User;
