// Include schema for Reactions as a subdocument to Thought
const { Schema, model } = require("mongoose");

const thoughtSchema = new Schema(
    {
        thoughtText:{
            type: String,
            required:true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt:{
            type: Date,
            default: Date.now
        },
        username:{
            type:String,
            required: true,
        },
        reactions:[{
            reactionID: {
                type: Schema.Types.ObjectId,
                default: new Schema.Types.ObjectId
            },
            reactionBody:{},
            username:{},
            createdAt:{}
        }],
    },
    {

    }
)