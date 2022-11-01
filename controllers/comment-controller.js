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
  async removeComment({params},res){
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
    },

    //add Reply
    async addReply({params, body},res){
      try{
        const reply = await Comment.findOneAndUpdate(
            { _id : params.commentId},
            {$push: {replies: body}},
            {new: true, runValidators: true}
        )

        if(!reply){
            return res
                   .status(404)
                   .json({message: `No pizza found with this id`})
        }

        res.json(reply)
        return;
      }
      catch(err){
        res.status(500).json(err)
      }
    },

    //remove Reply
    async removeReply({params},res){
        try{
            const comment = await Comment.findByIdAndUpdate(
                {_id: params.commentId},
                {$pull: {replies: { replyId: params.replyId}}},
                {new: true}
            )
            if(!comment){
                return res
                    .status(500)
                    .json({message: `Couldn't find that comment`})
            }

            res.json(comment)
            return;
        }
        catch(err){
            res.status(500).json(err)
        }
    }
}


module.exports = commentController;
