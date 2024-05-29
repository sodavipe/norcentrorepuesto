import routerx from 'express-promise-router'
import productController from '../controllers/ProductController'
import auth from '../middleware/auth';

import multiparty from 'connect-multiparty'
var path = multiparty({uploadDir: './uploads/product'})
const router = routerx();

// http://localhost:3000/api/user/ + CRUDS

router.post("/register",[auth.verifyAdmin,path],productController.register);

router.post("/register_imagen",[auth.verifyAdmin,path],productController.register_imagen);
router.post("/remove_imagen",[auth.verifyAdmin,path],productController.remove_imagen);

router.put("/update",[auth.verifyAdmin,path],productController.update);
router.get("/list",auth.verifyAdmin,productController.list);
router.delete("/delete",auth.verifyAdmin,productController.remove);

router.get("/uploads/category/:img",productController.obtener_imagen);

export default router;