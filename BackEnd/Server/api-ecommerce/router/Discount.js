import routerx from 'express-promise-router'
import DiscountController from '../controllers/DiscountController';
import auth from '../middleware/auth';

const router = routerx();

router.post("/register", auth.verifyAdmin,DiscountController.register)
router.put("/update", auth.verifyAdmin,DiscountController.update)
router.get("/list", auth.verifyAdmin,DiscountController.list)
router.get("/config", auth.verifyAdmin,DiscountController.config)
router.get("/show", auth.verifyAdmin,DiscountController.show)
router.delete("/delete", auth.verifyAdmin,DiscountController.delete)

export default router;