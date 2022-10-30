const {Comment, Pizza} = require('../models')

const commentController = {
    //add Comment to pizza
   async addComment({params,body}, res){
        try{
           const { _id } = await Comment.create(body)

           if(!_id){
            return res
                   .status(500)
                   .json({message : `Couldn't create comment check server`})
           }

           const pizza = await Pizza.findOneAndUpdate(
            { _id: params.pizzaId},
            {$push: {comments: _id}},
            {new: true}
            )

            if(!pizza){
                return res
                       .status(404)
                       .json({message:`Couldn't not find any pizza with that id`})
            }

            res.json(pizza)
            return;
        }
        catch(err){
            res.status(500).json(err)
        }
    },

  //remove comment
  async removeComment({params,res}){
         try{
            const deletedComment = await Comment.findOneAndDelete({ _id: params.commentId })
            if(!deletedComment){
                return res
                        .status(404)
                        .json({message: `Couldn't find a comment with this id`})
            }

            const pizza = await Pizza.findOneAndUpdate(
                {_id : params.pizzaId},
                {$pull: {comments: params.commentId}},
                {new: true}
            )
        
    
            if(!pizza){
                return res
                .status(404)
                .json({message: `Couldn't find a pizza with this id`})
            } 
            
            res.json(pizza)
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}


module.exports = commentController;