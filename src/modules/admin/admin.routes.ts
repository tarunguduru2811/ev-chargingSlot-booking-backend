import { Router } from "express";
import { authMiddleWare, authorize } from "../../middlewares/auth.middleware";
import { dashboardController, revenueController, trendsController, utilizationController } from "./admin.controller";



const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Analytics APIs
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Invalid request
 */
router.get("/dashboard",authMiddleWare,authorize(["SUPER_ADMIN"]),dashboardController)



/**
 * @swagger
 * /admin/revenue:
 *   get:
 *     summary: Get revenue stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Invalid request
 */
router.get("/revenue",authMiddleWare,authorize(["SUPER_ADMIN"]),revenueController)



/**
 * @swagger
 * /admin/trends:
 *   get:
 *     summary: Get booking trends
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Invalid request
 */
router.get("/trends",authMiddleWare,authorize(["SUPER_ADMIN"]),trendsController)


/**
 * @swagger
 * /admin/utilization:
 *   get:
 *     summary: Get slot utilization
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Invalid request
 * responses:
 *       200:
 *         description: List of bookings
 */
router.get("/utilization",authMiddleWare,authorize(["SUPER_ADMIN"]),utilizationController);


export default router;