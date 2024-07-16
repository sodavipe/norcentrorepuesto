import routerx from 'express-promise-router'
import CartController from '../controllers/CartController'
import auth from '../middleware/auth'

const router = routerx();

router.get("list",auth.verifyEcommerce,CartController.list);
router.post("register",auth.verifyEcommerce,CartController.register);
router.put("update",auth.verifyEcommerce,CartController.update);
router.delete("delete/:id",auth.verifyEcommerce,CartController.delete);

export default router;