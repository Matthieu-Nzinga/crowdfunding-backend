const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "secret";


const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  
  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({
        error: "Tous les champs sont requis (name, email, password, role)",
      });
  }

  try {
   
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, 
      },
    });

    
    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    
    const user = await prisma.user.findUnique({ where: { email } });

    
    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

   
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Répondre avec le token
    res.json({ token });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
};


const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const { password, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};


const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  let updatedData = { name, email };

  if (password) {
    updatedData.password = await bcrypt.hash(password, 10);
  }

  try {
    const user = await prisma.user.update({
      where: { id }, 
      data: updatedData,
    });
    res
      .status(200)
      .json({ message: "Utilisateur mis à jour avec succès", user });
  } catch (error) {
    console.error("Erreur Prisma:", error);
    res.status(400).json({
      error: "Erreur lors de la mise à jour de l'utilisateur",
      details: error.message,
    });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur Prisma:", error);
    res.status(400).json({
      error: "Erreur lors de la suppression de l'utilisateur",
      details: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
