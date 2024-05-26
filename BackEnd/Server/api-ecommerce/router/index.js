import routerx from 'express-promise-router'
import User from './User'
import Category from './Category'

const router = routerx();
router.use('/user',User);
router.use('/categories',Category);

export default router;