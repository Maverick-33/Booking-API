import { PrismaClient } from "@prisma/client";
import logger from "../logger.js";

const prisma = new PrismaClient();

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany();
    res.status(200).json(bookings);
  } catch (error) {
    logger.error("Error fetching bookings: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
    });
    if (!booking) {
      logger.warn("Booking not found: %s", id);
      return res.status(404).send("Booking not found");
    }
    res.status(200).json(booking);
  } catch (error) {
    logger.error("Error fetching booking by ID: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const createBooking = async (req, res) => {
  const {
    userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus,
  } = req.body;
  try {
    const booking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        numberOfGuests,
        totalPrice,
        bookingStatus,
      },
    });
    res.status(201).json(booking);
  } catch (error) {
    logger.error("Error creating booking: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const updateBooking = async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus,
  } = req.body;
  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        userId,
        propertyId,
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        numberOfGuests,
        totalPrice,
        bookingStatus,
      },
    });
    res.status(200).json(booking);
  } catch (error) {
    logger.error("Error updating booking: %o", error);
    res.status(500).send("Internal server error");
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.booking.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    logger.error("Error deleting booking: %o", error);
    res.status(500).send("Internal server error");
  }
};
