import { Router } from "express";
import {
  createStationController,
  getStationsController,
  getStationController,
  updateStationController,
  deleteStationController,
  getNearbyStationsController,
} from "./station.controller";
import { authMiddleWare, authorize } from "../../middlewares/auth.middleware";

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Stations
 *   description: Charging Station Management APIs
 */


/**
 * @swagger
 * /stations/nearby:
 *   get:
 *     summary: Get nearby charging stations with pagination & filters
 *     tags: [Stations]
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *       - name: lng
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *       - name: radius
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           example: 5
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *           example: 10
 *       - name: search
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *           example: EV Hub
 *     responses:
 *       200:
 *         description: Paginated nearby stations
 */
router.get("/nearby",getNearbyStationsController)


/**
 * @swagger
 * /stations:
 *   get:
 *     summary: Get all charging stations (Public)
 *     tags: [Stations]
 *     responses:
 *       200:
 *         description: List of stations
 */
router.get("/", getStationsController);

/**
 * @swagger
 * /stations/{id}:
 *   get:
 *     summary: Get a station by ID
 *     tags: [Stations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station details
 *       404:
 *         description: Station not found
 */
router.get("/:id", getStationController);

/**
 * @swagger
 * /stations:
 *   post:
 *     summary: Create a charging station (SUPER_ADMIN only)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - latitude
 *               - longitude
 *             properties:
 *               name:
 *                 type: string
 *                 example: EV Hub Vizag
 *               address:
 *                 type: string
 *                 example: Beach Road
 *               latitude:
 *                 type: number
 *                 example: 17.68
 *               longitude:
 *                 type: number
 *                 example: 83.21
 *     responses:
 *       201:
 *         description: Station created successfully
 *       403:
 *         description: Forbidden (Only SUPER_ADMIN)
 */
router.post(
  "/",
  authMiddleWare,
  authorize(["SUPER_ADMIN"]),
  createStationController
);

/**
 * @swagger
 * /stations/{id}:
 *   put:
 *     summary: Update a charging station (SUPER_ADMIN only)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       200:
 *         description: Station updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Station not found
 */
router.put(
  "/:id",
  authMiddleWare,
  authorize(["SUPER_ADMIN","STATION_ADMIN"]),
  updateStationController
);


/**
 * @swagger
 * /stations/{id}:
 *   delete:
 *     summary: Delting a charging station (SUPER_ADMIN only)
 *     tags: [Stations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Station ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Station Deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Station not found
 */
router.delete(
  "/:id",
  authMiddleWare,
  authorize(["STATION_ADMIN","SUPER_ADMIN"]),
  deleteStationController
);



export default router;