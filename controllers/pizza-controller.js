const {Pizza} = require('../models')

const pizzaController ={
    // Get all Pizzas
    async getAllPizzas(req,res){
        try{
            const pizza = await Pizza.find({})

            if(!pizza.length){
                return res
                .status(404)
                .json({message: "There are no Pizzas yet"})
            }

            res.json(pizza)
            return;

        }
        catch(err){
            res.status(500).json(err)
        }
    },

    // To get a single pizza by it's ID
    async getPizzaById({params},res){
        try{
            const pizza = await Pizza.findOne({_id: params.id})

            if(!pizza){
                return res
                .status(404)
                .json({message: "Couldn't find any pizza with this Id"})
            }

            res.json(pizza)
            return;
        }
        catch(err){
            res.status(500).json(err)
        }
    },

    //To create a single pizza
    async createPizza({body},res){
         try{
            const pizza = await Pizza.create(body)
            res.json(pizza)
         }
         catch(err){
            res.status(500).json(err)
         }
    },

    //To update a single pizza
    async updatePizza({params,body}, res){
        try{
        const pizza = await Pizza.findOneAndUpdate({_id : params.id}, body, {new: true})

        if(!pizza){
            return res
            .status(404)
            .json({message: "No Pizza was found with this id"})
        }

        res.json(pizza)
        return;   
        }

        catch(err){
            res.status(500).json(err)
        }
    },

    //To delete a single Pizza
    async deleteOnePizza({params}, res){
        try{
            const pizza = await Pizza.findByIdAndDelete({_id: params.id})

            if(!pizza){
                return res
                .status(404)
                .json({message: "Could not find that pizza"})
            }

            res.json(pizza)
        }
        catch(err){
            res.status(500).json(err)
        }
    }

}

module.exports = pizzaController