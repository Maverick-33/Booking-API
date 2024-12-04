import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import logger from "../logger.js";

const prisma = new PrismaClient();

export const getAllHosts = async (req, res) => {
  try {
    const hosts = await prisma.host.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        aboutMe: true,
      },
    });
    res.status(200).json(hosts);
  } catch (error) {
    logger.error("Error fetching hosts: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const getHostById = async (req, res) => {
  const { id } = req.params;
  try {
    const host = await prisma.host.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phoneNumber: true,
        profilePicture: true,
        aboutMe: true,
      },
    });
    if (!host) {
      logger.warn("Host not found: %s", id);
      return res.status(404).send("Host not found");
    }
    res.status(200).json(host);
  } catch (error) {
    logger.error("Error fetching host by ID: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const createHost = async (req, res) => {
  const {
    username,
    password,
    name,
    email,
    phoneNumber,
    profilePicture,
    aboutMe,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const host = await prisma.host.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        phoneNumber,
        profilePicture,
        aboutMe,
      },
    });
    res.status(201).json(host);
  } catch (error) {
    logger.error("Error creating host: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const updateHost = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    name,
    email,
    phoneNumber,
    profilePicture,
    aboutMe,
    password,
  } = req.body;
  try {
    const data = {
      username,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const host = await prisma.host.update({
      where: { id },
      data,
    });
    res.status(200).json(host);
  } catch (error) {
    logger.error("Error updating host: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const deleteHost = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.host.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting host: %o", error);
    res.status(500).send("Internal server error");
  }
};
