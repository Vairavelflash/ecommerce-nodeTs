import prisma from "../../lib/prisma";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: string,
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      role
    },
  });
};
