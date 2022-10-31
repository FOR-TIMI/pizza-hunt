const {Schema, model} = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const pizzaSchema = new Schema({
    pizzaName : {
        type : String,
        required: 'You need to provide a pizza name',
        trim:true
    },
    createdBy:{
        type: String,
        required: true,
        trim: true
    },
    createdAt:{
        type: Date,
        default: Date.now,
        get: function(createdAtVal){
            return dateFormat(createdAtVal)
        }
    },
    size:{
        type : String,
        required:true,
        enum: ['Personal','Small','Medium', 'Large', 'Extra Large'],
        default: 'Large',
    },
    toppings: [],
    comments :[
        {
            type : Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
},
    //To add configuration
{
    // To allow use of virtuals 
    toJSON:{
      virtuals: true,
      getters: true
    },
    //since we don't need ids for the virtuals
    id : false   
}
);


/**
 * Expect: { commentCount : `Length of comments array`}
 * 
 */
pizzaSchema
.virtual('commentCount')
.get(function(){
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1,0);
})

// create pizza model using the PizzaSchema
const Pizza = model('Pizza', pizzaSchema)


//export pizza model
module.exports = Pizza;