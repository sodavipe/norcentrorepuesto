import routerx from 'express-promise-router'
import SliderController from '../controllers/SliderController';
import auth from '../middleware/auth';

import multiparty from 'connect-multiparty'
var path = multiparty({uploadDir: './uploads/slider'})
const router = routerx();

// http://localhost:3000/api/user/ + CRUDS

router.post("/register",[auth.verifyAdmin,path],SliderController.register);
router.put("/update",[auth.verifyAdmin,path],SliderController.update);
router.get("/list",auth.verifyAdmin,SliderController.list);
router.delete("/delete",auth.verifyAdmin,SliderController.remove);

router.get("/uploads/slider/:img",SliderController.obtener_imagen);

export default router;