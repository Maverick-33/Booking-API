import { PrismaClient } from "@prisma/client";
import logger from "../logger.js";

const prisma = new PrismaClient();

export const getAllAmenities = async (req, res) => {
  try {
    const amenities = await prisma.amenity.findMany();
    res.status(200).json(amenities);
  } catch (error) {
    logger.error("Error fetching amenities: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const getAmenityById = async (req, res) => {
  const { id } = req.params;
  try {
    const amenity = await prisma.amenity.findUnique({
      where: { id: Number(id) },
    });
    if (!amenity) {
      logger.warn("Amenity not found: %d", id);
      return res.status(404).send("Amenity not found");
    }
    res.status(200).json(amenity);
  } catch (error) {
    logger.error("Error fetching amenity by ID: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const createAmenity = async (req, res) => {
  const { name, description } = req.body;
  try {
    const amenity = await prisma.amenity.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json(amenity);
  } catch (error) {
    logger.error("Error creating amenity: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const updateAmenity = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const amenity = await prisma.amenity.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
      },
    });
    res.status(200).json(amenity);
  } catch (error) {
    logger.error("Error updating amenity: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const deleteAmenity = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.amenity.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting amenity: %o", error);
    res.status(500).send("Internal server error");
  }
};
