import routerx from 'express-promise-router'
import userController from '../controllers/UserController'
import auth from '../middleware/auth';

const router = routerx();

// http://localhost:3000/api/user/ + CRUDS

router.post("/register",userController.register);
router.put("/update",userController.update);
router.get("/list",auth.verifyAdmin,userController.list);
router.post("/login",userController.login);
router.delete("/delete",userController.remove);


export default router;