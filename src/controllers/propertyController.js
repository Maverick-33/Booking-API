import { PrismaClient } from "@prisma/client";
import logger from "../logger.js";

const prisma = new PrismaClient();

export const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany();
    res.status(200).json(properties);
  } catch (error) {
    logger.error("Error fetching properties: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });
    if (!property) {
      logger.warn("Property not found: %s", id);
      return res.status(404).send("Property not found");
    }
    res.status(200).json(property);
  } catch (error) {
    logger.error("Error fetching property by ID: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const createProperty = async (req, res) => {
  const {
    title,
    description,
    location,
    pricePerNight,
    bedroomCount,
    bathRoomCount,
    maxGuestCount,
    rating,
    hostId,
  } = req.body;
  try {
    const property = await prisma.property.create({
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        rating,
        hostId,
      },
    });
    res.status(201).json(property);
  } catch (error) {
    logger.error("Error creating property: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    pricePerNight,
    bedroomCount,
    bathRoomCount,
    maxGuestCount,
    rating,
    hostId,
  } = req.body;
  try {
    const property = await prisma.property.update({
      where: { id },
      data: {
        title,
        description,
        location,
        pricePerNight,
        bedroomCount,
        bathRoomCount,
        maxGuestCount,
        rating,
        hostId,
      },
    });
    res.status(200).json(property);
  } catch (error) {
    logger.error("Error updating property: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.property.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting property: %o", error);
    res.status(500).send("Internal server error");
  }
};
