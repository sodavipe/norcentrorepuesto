// newsletterRoutes.js
import express from 'express';
import { subscribeToNewsletter } from '../controllers/SubscriptionController'; // Ajusta la ruta según tu estructura de carpetas

const router = express.Router();

// **Ruta para suscribirse al boletín**
router.post('/subscribe', subscribeToNewsletter);

export default router;
