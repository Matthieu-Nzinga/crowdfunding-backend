const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../cloudinaryConfig"); 

const createProject = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "Aucune image n'a été téléchargée" });
    }

    
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "crowdfunding",
    });

    console.log("☁️ Cloudinary Response :", result);

    
    const { title, description, category, targetAmount, ownerId } = req.body;

    if (!title || !description || !category || !targetAmount || !ownerId) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        category,
        goal: parseFloat(targetAmount), 
        ownerId,
        image: result.secure_url, 
      },
    });

    res.status(201).json({
      message: "Projet créé avec succès",
      project,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création du projet :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};


const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la récupération des projets" });
  }
};


const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id }, 
    });

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la récupération du projet" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, goal, category, status } = req.body;

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        goal,
        category,
        status,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du projet :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};



const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    
    await prisma.project.delete({
      where: { id },
    });

    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du projet:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression du projet",
      details: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
