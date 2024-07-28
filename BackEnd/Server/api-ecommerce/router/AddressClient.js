import routerx from 'express-promise-router'
import AddresClientController from '../controllers/AddressClientController'
import auth from '../middleware/auth';

import multiparty from 'connect-multiparty'
var path = multiparty({uploadDir: './uploads/category'})
const router = routerx();

// http://localhost:3000/api/user/ + CRUDS

router.post("/register",auth.verifyAdmin,AddresClientController.register);
router.put("/update",auth.verifyAdmin,AddresClientController.update);
router.get("/list",auth.verifyAdmin,AddresClientController.list);
router.delete("/delete/:id",auth.verifyAdmin,AddresClientController.remove);

export default router;