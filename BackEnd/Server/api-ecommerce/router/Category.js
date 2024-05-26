import routerx from 'express-promise-router'
import categoryController from '../controllers/CategoryController'
import auth from '../middleware/auth';

import multiparty from 'connect-multiparty'
var path = multiparty({uploadDir: './uploads/category'})
const router = routerx();

// http://localhost:3000/api/user/ + CRUDS

router.post("/register",[auth.verifyAdmin,path],categoryController.register);
router.put("/update",[auth.verifyAdmin,path],categoryController.update);
router.get("/list",auth.verifyAdmin,categoryController.list);
router.delete("/delete",auth.verifyAdmin,categoryController.remove);


export default router;