const router = require('express').Router();
const pizzaRoutes = require('./pizza-routes');
const commentRoutes = require('./comment-routes');

router.use('/comments', commentRoutes)
// add prefix of `/pizzas` to routes created in `pizza-routes.js`
router.use('/pizza',pizzaRoutes)








module.exports = router