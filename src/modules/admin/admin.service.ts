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


export const adminService={
    getAllUsersDB
}
