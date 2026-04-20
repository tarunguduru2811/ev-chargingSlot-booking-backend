import { Router } from "express";
import {
  createSlotController,
  deleteSlotController,
  getAdminSlotsController,
  getAvailableSlotsController,
  getSlotsController,
  updateSlotController,
  updateSlotStatusController,
} from "./slot.controller";

import { authMiddleWare, authorize } from "../../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Slots
 *   description: Slot Management APIs
 */

/**
 * @swagger
 * /slots/available:
 *   get:
 *     summary: Get available slots (Public)
 *     tags: [Slots]
 *     parameters:
 *       - name: stationId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-04-20
 *     responses:
 *       200:
 *         description: Available slots list
 */
router.get("/available", getAvailableSlotsController);

/**
 * @swagger
 * /slots/admin:
 *   get:
 *     summary: Get all slots for logged-in admin
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin slots
 */
router.get(
  "/admin",
  authMiddleWare,
  authorize(["STATION_ADMIN"]),
  getAdminSlotsController
);

/**
 * @swagger
 * /slots:
 *   get:
 *     summary: Get slots by station and date
 *     tags: [Slots]
 *     parameters:
 *       - name: stationId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: date
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: 2026-04-20
 *     responses:
 *       200:
 *         description: List of slots
 */
router.get("/", getSlotsController);

/**
 * @swagger
 * /slots:
 *   post:
 *     summary: Create slot (STATION_ADMIN only)
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stationId
 *               - startTime
 *               - endTime
 *             properties:
 *               stationId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 example: 2026-04-20T10:00:00.000Z
 *               endTime:
 *                 type: string
 *                 example: 2026-04-20T11:00:00.000Z
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Slot created
 */
router.post(
  "/",
  authMiddleWare,
  authorize(["STATION_ADMIN"]),
  createSlotController
);

/**
 * @swagger
 * /slots/{id}:
 *   put:
 *     summary: Update slot (STATION_ADMIN only)
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Slot ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Slot updated
 */
router.put(
  "/:id",
  authMiddleWare,
  authorize(["STATION_ADMIN"]),
  updateSlotController
);

/**
 * @swagger
 * /slots/{id}:
 *   delete:
 *     summary: Delete slot (only if not booked)
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Slot deleted
 */
router.delete(
  "/:id",
  authMiddleWare,
  authorize(["STATION_ADMIN"]),
  deleteSlotController
);

/**
 * @swagger
 * /slots/{id}/status:
 *   patch:
 *     summary: Block or unblock slot
 *     tags: [Slots]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: BLOCKED
 *     responses:
 *       200:
 *         description: Slot status updated
 */
router.patch(
  "/:id/status",
  authMiddleWare,
  authorize(["STATION_ADMIN","SUPER_ADMIN"]),
  updateSlotStatusController
);

export default router;