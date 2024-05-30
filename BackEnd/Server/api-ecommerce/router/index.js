import routerx from 'express-promise-router'
import User from './User'
import Category from './Category'
import Products from './Product'

const router = routerx();
router.use('/user',User);
router.use('/categories',Category);
router.use('/products',Products)

export default router;