import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProject = async (req, res) => {
  const { title, description, amount } = req.body;
  const { userId } = req.user;

  const project = await prisma.project.create({
    data: { title, description, amount, ownerId: userId },
  });

  res.json(project);
};

export const getAllProjects = async (req, res) => {
  const projects = await prisma.project.findMany({
    include: { owner: true, investments: true },
  });
  res.json(projects);
};
