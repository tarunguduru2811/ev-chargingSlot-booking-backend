import { Router } from "express";
import {
  createBookingController,
  getMyBookingsController,
  cancelBookingController,
} from "./booking.controller";

import { authMiddleWare, authorize } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking Management APIs
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create booking (USER only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slotId
 *             properties:
 *               slotId:
 *                 type: string
 *                 example: slot-id-here
 *     responses:
 *       201:
 *         description: Booking successful
 *       400:
 *         description: Slot not available or validation error
 */
router.post(
  "/",
  authMiddleWare,
  authorize(["USER"]),
  createBookingController
);

/**
 * @swagger
 * /bookings/my:
 *   get:
 *     summary: Get logged-in user's bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get(
  "/my",
  authMiddleWare,
  authorize(["USER"]),
  getMyBookingsController
);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Booking ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Invalid request
 */
router.patch(
  "/:id/cancel",
  authMiddleWare,
  authorize(["USER"]),
  cancelBookingController
);

export default router;