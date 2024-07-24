import routerx from 'express-promise-router'
import User from './User'
import Category from './Category'
import Products from './Product'
import Slider from './Slider';
import Cupone from './Cupone';
import Discount from './Discount'
import Home from './Home'
import Cart from './Cart';

const router = routerx();
router.use('/user',User);
router.use('/categories',Category);
router.use('/products',Products);
router.use('/sliders',Slider);
router.use('/cupones',Cupone);
router.use('/discount',Discount);
router.use('/home',Home);
router.use('/cart',Cart);


export default router;