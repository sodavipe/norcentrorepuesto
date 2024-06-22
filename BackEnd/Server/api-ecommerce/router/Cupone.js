import routerx from 'express-promise-router'
import cuponeController from '../controllers/CuponeController'
import auth from '../middleware/auth';

const router = routerx();

router.post("/register",auth.verifyAdmin,cuponeController.register);
router.put("/update",auth.verifyAdmin,cuponeController.update);
router.get("/list",auth.verifyAdmin,cuponeController.list);
router.get("/config",auth.verifyAdmin,cuponeController.config);
router.get("/show",auth.verifyAdmin,cuponeController.show);
router.delete("/delete",auth.verifyAdmin,cuponeController.delete);

export default router;