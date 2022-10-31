const {Schema, model, Types} = require('mongoose');
const dateFormat = require('../utils/dateFormat')


const replySchema = new Schema({
     // set custom id to avoid confusion with parent comment _id
    replyId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    replyBody: {
        type: String,
        trim: true,
        required: true
    },
    writtenBy:{
        type: String,
        trim: true,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        get : function(createdAtVal){
            return dateFormat(createdAtVal);
        }
    },
},
{
    toJSON:{
        getters: true
    }
}
);


const commentSchema  = new Schema({
    writtenBy: {
        type : String,
        trim: true,
        required: true
    },
    commentBody :{
        type : String,
        trim: true,
        required: true
    },
    createdAt: {
        type : Date,
        default : Date.now,
        get: function(createdAtVal){
          return dateFormat(createdAtVal)
        }
    },
    replies: [replySchema]
},
{
    toJSON:{
        virtuals: true,
        getters: true
    },
    id: false
})


commentSchema
.virtual('replyCount')
.get(function(){
    return this.replies.length;
});

const Comment = model('Comment', commentSchema);


module.exports = Comment;