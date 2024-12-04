import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import logger from "../logger.js";

const prisma = new PrismaClient();

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    logger.error("Error fetching users: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
      },
    });
    if (!user) {
      logger.warn("User not found: %s", id);
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    logger.error("Error fetching user by ID: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const createUser = async (req, res) => {
  const { username, password, name, email, phoneNumber, profilePicture } =
    req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        phoneNumber,
        profilePicture,
      },
    });
    res.status(201).json(user);
  } catch (error) {
    logger.error("Error creating user: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, name, email, phoneNumber, profilePicture, password } =
    req.body;
  try {
    const data = {
      username,
      name,
      email,
      phoneNumber,
      profilePicture,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });
    res.status(200).json(user);
  } catch (error) {
    logger.error("Error updating user: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting user: %o", error);
    res.status(500).send("Internal server error");
  }
};
