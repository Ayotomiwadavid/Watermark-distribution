const { getSoftwares, getSoftwareById, downloadSoftware, uploadSoftware } = require('../controllers/softwareController')
const router = require('express').Router()
const protect = require('../middlewares/authMiddleware')


/**
 * @swagger
 * /softwares:
 *   get:
 *     summary: Retrieve a list of softwares
 *     responses:
 *       200:
 *         description: A list of softwares
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 softwares:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Software'
 * /softwares/{id}:
 *   get:
 *     summary: Retrieve a software by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The software ID
 *     responses:
 *       200:
 *         description: A software object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 software:
 *                   $ref: '#/components/schemas/Software'
 * /softwares/new:
 *   post:
 *     summary: Upload a new software
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               version:
 *                 type: string
 *               description:
 *                 type: string
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Software uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     version:
 *                       type: string
 *                     fileUrl:
 *                       type: string
 *                     uploadedAt:
 *                       type: string
 *                       format: date-time
 * /softwares/download:
 *   get:
 *     summary: Download a software
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Software download URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 downloadUrl:
 *                   type: string
 */
router.get('/softwares', getSoftwares)
router.get('/softwares/:id', getSoftwareById)
router.post('/softwares/new', protect, uploadSoftware)
router.get('/softwares/download', protect, downloadSoftware)

module.exports = router