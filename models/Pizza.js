const {Schema, model} = require('mongoose');
const dateFormat = require('../utils/dateFormat')

const pizzaSchema = new Schema({
    pizzaName : {
        type : String
    },
    createdBy:{
        type: String
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
        default: 'Large'
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
    return this.comments.length;
})

// create pizza model using the PizzaSchema
const Pizza = model('Pizza', pizzaSchema)


//export pizza model
module.exports = Pizza;