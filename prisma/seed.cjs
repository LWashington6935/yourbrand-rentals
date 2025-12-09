// prisma/seed.cjs
const { PrismaClient, CarType, Transmission, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const demoPasswordHash = await bcrypt.hash("Demo123!", 10);

  // Admin/company user
  const admin = await prisma.user.upsert({
    where: { email: "admin@yourbrandrentals.com" },
    update: {
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
    create: {
      email: "admin@yourbrandrentals.com",
      name: "YourBrand Admin",
      role: UserRole.ADMIN,
      phone: "555-000-0000",
      passwordHash: adminPasswordHash,
    },
  });

  // Demo customer
  await prisma.user.upsert({
    where: { email: "demo@customer.com" },
    update: {
      passwordHash: demoPasswordHash,
      role: UserRole.CUSTOMER,
    },
    create: {
      email: "demo@customer.com",
      name: "Demo Customer",
      role: UserRole.CUSTOMER,
      phone: "555-111-1111",
      passwordHash: demoPasswordHash,
    },
  });

  // Company owner profile (belongs to admin)
  const companyOwner = await prisma.ownerProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      displayName: "YourBrand Rentals",
      bio: "Local Columbus car rental fleet.",
      city: "Columbus",
      isCompany: true,
    },
  });

  // Clean out cars & bookings for a fresh seed
  await prisma.booking.deleteMany();
  await prisma.car.deleteMany();

  const carsData = [
    {
      title: "2021 Toyota Camry LE",
      brand: "Toyota",
      model: "Camry",
      year: 2021,
      type: CarType.SEDAN,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      pricePerDay: 6500,
      city: "Columbus",
      mainImageUrl: "/cars/camry.jpg",
      imageUrls: ["/cars/camry.jpg"],
      description: "Comfortable midsize sedan, great on gas, perfect for city trips.",
    },
    {
      title: "2022 Honda CR-V EX",
      brand: "Honda",
      model: "CR-V",
      year: 2022,
      type: CarType.SUV,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      pricePerDay: 8500,
      city: "Columbus",
      mainImageUrl: "/cars/crv.jpg",
      imageUrls: ["/cars/crv.jpg"],
      description: "Spacious SUV with plenty of cargo room and all-wheel drive.",
    },
    {
      title: "2020 BMW 3 Series 330i",
      brand: "BMW",
      model: "330i",
      year: 2020,
      type: CarType.LUXURY,
      seats: 5,
      transmission: Transmission.AUTOMATIC,
      pricePerDay: 12000,
      city: "Columbus",
      mainImageUrl: "/cars/bmw3.jpg",
      imageUrls: ["/cars/bmw3.jpg"],
      description: "Luxury sedan for business trips, nights out, and special occasions.",
    },
  ];

  for (const data of carsData) {
    await prisma.car.create({
      data: {
        ...data,
        ownerId: companyOwner.id,
        isCompanyOwned: true,
        isActive: true,
      },
    });
  }

  console.log("Database seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
