import { prisma } from "../../lib/prisma";


const getAllUsersDB = async () => {
  const result = await prisma.user.findMany({
    omit: { password: true },
  });

  return result;
};



const updateUserStatusDB = async (userId: string, status: "ACTIVE" | "BANNED") => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  if (status !== "ACTIVE" && status !== "BANNED") {
    throw new Error("Status must be either ACTIVE or BANNED");
  }

  const result = await prisma.user.update({
    where: { id: userId },
    data: { status },
    omit: { password: true },
  });

  return result;
};



const getAllPropertiesDB = async () => {
  const result = await prisma.property.findMany({
    include: {
      landlord: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};



const getAllRentalsDB = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      tenant: {
        select: { id: true, name: true, email: true },
      },
      property: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};




const getAllPaymentsDB = async () => {
  const result = await prisma.payment.findMany({
    include: {
      rentalRequest: {
        include: {
          tenant: { select: { id: true, name: true, email: true } },
          property: {
            include: {
              landlord: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

export const adminService={
    getAllUsersDB,
    updateUserStatusDB,
    getAllPropertiesDB,
    getAllRentalsDB,
    getAllPaymentsDB
}
