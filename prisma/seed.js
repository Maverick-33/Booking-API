import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bookingsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "bookings.json"
);
const usersFilePath = path.join(__dirname, "..", "src", "data", "users.json");
const propertiesFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "properties.json"
);
const hostsFilePath = path.join(__dirname, "..", "src", "data", "hosts.json");
const amenitiesFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "amenities.json"
);
const reviewsFilePath = path.join(
  __dirname,
  "..",
  "src",
  "data",
  "reviews.json"
);

// Log the resolved paths to ensure they are correct
console.log("Bookings JSON file path:", bookingsFilePath);
console.log("Users JSON file path:", usersFilePath);
console.log("Properties JSON file path:", propertiesFilePath);
console.log("Hosts JSON file path:", hostsFilePath);
console.log("Amenities JSON file path:", amenitiesFilePath);
console.log("Reviews JSON file path:", reviewsFilePath);

async function main() {
  let bookingsData,
    usersData,
    propertiesData,
    hostsData,
    amenitiesData,
    reviewsData;

  try {
    bookingsData = JSON.parse(fs.readFileSync(bookingsFilePath, "utf8"));
    usersData = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
    propertiesData = JSON.parse(fs.readFileSync(propertiesFilePath, "utf8"));
    hostsData = JSON.parse(fs.readFileSync(hostsFilePath, "utf8"));
    amenitiesData = JSON.parse(fs.readFileSync(amenitiesFilePath, "utf8"));
    reviewsData = JSON.parse(fs.readFileSync(reviewsFilePath, "utf8"));
  } catch (error) {
    console.error("Error reading JSON data:", error);
    return;
  }

  // Seeding Host data
  for (const host of hostsData.hosts) {
    const existingHost = await prisma.host.findUnique({
      where: { email: host.email },
    });

    if (!existingHost) {
      await prisma.host.create({
        data: {
          id: host.id,
          username: host.username,
          password: await bcrypt.hash(host.password, 10), // Hash the password
          name: host.name,
          email: host.email,
          phoneNumber: host.phoneNumber,
          profilePicture: host.profilePicture,
          aboutMe: host.aboutMe,
        },
      });
      console.log("Host created:", host.email, "with ID:", host.id);
    } else {
      console.log(
        "Host already exists:",
        host.email,
        "with ID:",
        existingHost.id
      );
    }
  }

  // Seeding Property data
  for (const property of propertiesData.properties) {
    if (!property.hostId) {
      console.error("Property missing hostId:", property.title);
      continue;
    }

    const existingHost = await prisma.host.findUnique({
      where: { id: property.hostId },
    });

    if (!existingHost) {
      console.error("Host not found for property:", property.hostId);
      continue;
    }

    const existingProperty = await prisma.property.findUnique({
      where: { id: property.id },
    });

    if (!existingProperty) {
      await prisma.property.create({
        data: {
          id: property.id,
          title: property.title,
          description: property.description,
          location: property.location,
          pricePerNight: property.pricePerNight,
          bedroomCount: property.bedroomCount,
          bathRoomCount: property.bathRoomCount,
          maxGuestCount: property.maxGuestCount,
          rating: property.rating,
          host: {
            connect: {
              id: property.hostId,
            },
          },
        },
      });
      console.log(
        "Property created:",
        property.title,
        "with Host ID:",
        property.hostId
      );
    } else {
      console.log(
        "Property already exists:",
        property.title,
        "with ID:",
        existingProperty.id
      );
    }
  }

  // Seeding Amenity data
  for (const amenity of amenitiesData.amenities) {
    await prisma.amenity.create({
      data: {
        name: amenity.name,
        description: amenity.description,
      },
    });
    console.log("Amenity created:", amenity.name);
  }

  // Seeding User data
  for (const user of usersData.users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          id: user.id,
          username: user.username,
          password: await bcrypt.hash(user.password, 10), // Hash the password
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture,
        },
      });
      console.log("User created:", user.email, "with ID:", user.id);
    } else {
      console.log(
        "User already exists:",
        user.email,
        "with ID:",
        existingUser.id
      );
    }
  }

  // Seeding Bookings data
  for (const booking of bookingsData.bookings) {
    const existingUser = await prisma.user.findUnique({
      where: { id: booking.userId },
    });

    const existingProperty = await prisma.property.findUnique({
      where: { id: booking.propertyId },
    });

    if (!existingUser) {
      console.error("User not found for booking:", booking.userId);
      continue;
    }

    if (!existingProperty) {
      console.error("Property not found for booking:", booking.propertyId);
      continue;
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
    });

    if (!existingBooking) {
      await prisma.booking.create({
        data: {
          id: booking.id,
          user: { connect: { id: booking.userId } },
          property: { connect: { id: booking.propertyId } },
          checkinDate: new Date(booking.checkinDate),
          checkoutDate: new Date(booking.checkoutDate),
          numberOfGuests: booking.numberOfGuests,
          totalPrice: booking.totalPrice,
          bookingStatus: booking.bookingStatus,
        },
      });
      console.log(
        "Booking created:",
        booking.id,
        "with User ID:",
        booking.userId,
        "and Property ID:",
        booking.propertyId
      );
    } else {
      console.log("Booking already exists:", booking.id);
    }
  }

  // Seeding Review data
  for (const review of reviewsData.reviews) {
    const existingUser = await prisma.user.findUnique({
      where: { id: review.userId },
    });

    const existingProperty = await prisma.property.findUnique({
      where: { id: review.propertyId },
    });

    if (!existingUser) {
      console.error("User not found for review:", review.userId);
      continue;
    }

    if (!existingProperty) {
      console.error("Property not found for review:", review.propertyId);
      continue;
    }

    const existingReview = await prisma.review.findUnique({
      where: { id: review.id },
    });

    if (!existingReview) {
      await prisma.review.create({
        data: {
          id: review.id,
          user: { connect: { id: review.userId } },
          property: { connect: { id: review.propertyId } },
          rating: review.rating,
          comment: review.comment,
        },
      });
      console.log(
        "Review created:",
        review.id,
        "with User ID:",
        review.userId,
        "and Property ID:",
        review.propertyId
      );
    } else {
      console.log("Review already exists:", review.id);
    }
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
