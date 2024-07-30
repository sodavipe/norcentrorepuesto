import routerx from 'express-promise-router'
import SaleController from '../controllers/SaleController'
import auth from '../middleware/auth';

import multiparty from 'connect-multiparty'
var path = multiparty({uploadDir: './uploads/category'})
const router = routerx();

// http://localhost:3000/api/user/ + CRUDS

router.post("/register",auth.verifyEcommerce,SaleController.register);
router.get("/send_email/:id",SaleController.sendEmail);

export default router;