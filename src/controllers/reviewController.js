import { PrismaClient } from "@prisma/client";
import logger from "../logger.js";

const prisma = new PrismaClient();

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.status(200).json(reviews);
  } catch (error) {
    logger.error("Error fetching reviews: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      logger.warn("Review not found: %s", id);
      return res.status(404).send("Review not found");
    }
    res.status(200).json(review);
  } catch (error) {
    logger.error("Error fetching review by ID: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const createReview = async (req, res) => {
  const { userId, propertyId, rating, comment } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        userId,
        propertyId,
        rating,
        comment,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    logger.error("Error creating review: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { userId, propertyId, rating, comment } = req.body;
  try {
    const review = await prisma.review.update({
      where: { id },
      data: {
        userId,
        propertyId,
        rating,
        comment,
      },
    });
    res.status(200).json(review);
  } catch (error) {
    logger.error("Error updating review: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.review.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting review: %o", error);
    res.status(500).send("Internal server error");
  }
};
