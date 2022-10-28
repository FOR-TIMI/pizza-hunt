const router =require('express').Router();
const {
    getAllPizzas,
    getPizzaById,
    updatePizza,
    deleteOnePizza,
    createPizza
} = require('../../controllers/pizza-controller');

/*
* Expect endPoint : /api/pizza
* To Get all Pizzas
*/
router.route('/')
       .get(getAllPizzas)
       .post(createPizza)


/**
 * Expect endpoint : /api/pizza/:id
 * To Get One Pizza
 * To Update one pizza
 * To delete One Pizza
 */
router.route('/:id')
      .get(getPizzaById)
      .put(updatePizza)
      .delete(deleteOnePizza)



module.exports = router

