const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Créer un projet
const createProject = async (req, res) => {
  const { title, description, targetAmount, ownerId } = req.body;

  console.log("Données reçues :", req.body); // Log des données reçues

  // Vérifier que tous les champs nécessaires sont présents
  if (!title || !description || !targetAmount || !ownerId) {
    return res.status(400).json({
      error:
        "Tous les champs sont requis (title, description, targetAmount, ownerId)",
    });
  }

  try {
    // Vérifier que l'utilisateur spécifié existe
    const userExists = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ error: "L'utilisateur spécifié n'existe pas" });
    }

    // Création du projet avec 'amount' et 'targetAmount' étant égaux
    const project = await prisma.project.create({
      data: {
        title,
        description,
        amount: targetAmount, // 'amount' doit être défini ici
        ownerId,
      },
    });

    // Retourner la réponse après la création du projet
    res.status(201).json({ message: "Projet créé avec succès", project });
  } catch (error) {
    console.error("Erreur lors de la création du projet:", error);
    res.status(500).json({
      error: "Erreur lors de la création du projet",
      details: error.message,
    });
  }
};

// Récupérer tous les projets
const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la récupération des projets" });
  }
};

// Récupérer un projet spécifique
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la récupération du projet" });
  }
};

// Mettre à jour un projet
const updateProject = async (req, res) => {
  const { title, description, targetAmount, ownerId } = req.body;
  const { id } = req.params; // Récupérer l'ID du projet à partir des paramètres de l'URL

  console.log("Données reçues pour la mise à jour :", req.body); // Log des données reçues

  // Vérifier que les champs requis sont présents
  if (!title || !description || !targetAmount || !ownerId) {
    return res
      .status(400)
      .json({
        error:
          "Tous les champs sont requis (title, description, targetAmount, ownerId)",
      });
  }

  try {
    // Vérifier que le projet existe
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    // Vérifier que l'utilisateur spécifié existe
    const userExists = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!userExists) {
      return res
        .status(400)
        .json({ error: "L'utilisateur spécifié n'existe pas" });
    }

    // Mise à jour du projet
    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        amount: targetAmount, // Mise à jour de 'amount' avec 'targetAmount'
        ownerId,
      },
    });

    // Retourner la réponse après la mise à jour du projet
    res
      .status(200)
      .json({ message: "Projet mis à jour avec succès", updatedProject });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    res
      .status(500)
      .json({
        error: "Erreur lors de la mise à jour du projet",
        details: error.message,
      });
  }
};

// Supprimer un projet
const deleteProject = async (req, res) => {
  const { id } = req.params; // Récupérer l'ID du projet à supprimer

  try {
    // Vérifier si le projet existe
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    // Supprimer le projet
    await prisma.project.delete({
      where: { id },
    });

    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    res.status(500).json({ error: "Erreur lors de la suppression du projet", details: error.message });
  }
};


module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
