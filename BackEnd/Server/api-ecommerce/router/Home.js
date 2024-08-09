import routerx from 'express-promise-router'
import homeController from '../controllers/HomeController'
import auth from '../middleware/auth';
const router = routerx();

router.get("/list",homeController.list);
router.get("/landing-product/:slug",homeController.show_landing_product);
router.post("/search_product",homeController.search_product);

router.post("/profile_client",auth.verifyEcommerce,homeController.profile_client);
router.post("/update_client",auth.verifyEcommerce,homeController.update_client);
export default router;