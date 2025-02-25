const express = require("express");
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller"); 
const { authenticateToken } = require("../middlewares/authMiddleware.js");
const upload = require("../upload.js");
const cloudinary = require("../cloudinaryConfig.js");


const router = express.Router();


/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Créer un nouveau projet avec une image
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - targetAmount
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *       400:
 *         description: Erreur lors de la création du projet
 */

router.post("/", upload.single("image"), createProject);

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Récupérer tous les projets
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Liste des projets récupérée avec succès
 *       400:
 *         description: Erreur lors de la récupération des projets
 */
router.get("/", getProjects);


/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Récupérer un projet par son ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du projet
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projet récupéré avec succès
 *       404:
 *         description: Projet non trouvé
 *       400:
 *         description: Erreur lors de la récupération du projet
 */
router.get("/:id", getProjectById);


/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Mettre à jour un projet existant
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               goal:
 *                 type: number
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:id", updateProject);


/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du projet à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
 *       400:
 *         description: Erreur lors de la suppression du projet
 */
router.delete("/:id", deleteProject);

module.exports = router;
