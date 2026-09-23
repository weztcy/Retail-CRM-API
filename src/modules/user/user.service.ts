import { prisma } from "@/lib/prisma";

import { hashPassword } from "@/modules/auth/auth.utils";

import type {
  CreateUserInput,
  UpdateUserInput,
  UpdateUserProfileInput,
} from "./user.types";

import { ApiError } from "@/utils/errors/api-error";

import { createAuditLog } from "@/modules/audit/audit.service";

import { deleteUserImage } from "./user.utils";

// =========================
// GET ALL USERS
// =========================

export async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      createdAt: true,

      updatedAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

// =========================
// GET USER BY ID
// =========================

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },

    select: {
      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      createdAt: true,

      updatedAt: true,
    },
  });
}

// =========================
// GET USER PROFILE
// SELF
// =========================

export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,

      name: true,

      email: true,

      imageUrl: true,

      role: true,

      isActive: true,

      createdAt: true,

      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError("User tidak ditemukan", 404);
  }

  return user;
}

// =========================
// CREATE USER
// =========================

export async function createUser(data: CreateUserInput, userId: string) {
  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,

      email: data.email,

      passwordHash,

      role: data.role,
    },

    select: {
      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      createdAt: true,
    },
  });

  // =========================
  // CREATE AUDIT LOG
  // =========================

  await createAuditLog({
    userId,

    action: "CREATE",

    module: "USER",

    description: `Membuat user ${user.email}`,
  });

  return user;
}

// =========================
// UPDATE USER
// =========================

export async function updateUser(
  id: string,
  data: UpdateUserInput,
  userId: string,
) {
  const user = await prisma.user.update({
    where: {
      id,
    },

    data: {
      name: data.name,

      email: data.email,

      role: data.role,

      isActive: data.isActive,
    },

    select: {
      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      updatedAt: true,
    },
  });

  // =========================
  // CREATE AUDIT LOG
  // =========================

  await createAuditLog({
    userId,

    action: "UPDATE",

    module: "USER",

    description: `Mengubah data user ${user.email}`,
  });

  return user;
}

// =========================
// UPDATE USER PROFILE
// SELF
// =========================

export async function updateUserProfile(
  userId: string,

  data: UpdateUserProfileInput,
) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,

      email: true,

      imageUrl: true,
    },
  });

  if (!user) {
    throw new ApiError("User tidak ditemukan", 404);
  }

  const updateData: any = {
    name: data.name,

    email: data.email,

    imageUrl: data.imageUrl,
  };

  if (data.password) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: updateData,

    select: {
      id: true,

      name: true,

      email: true,

      imageUrl: true,

      role: true,

      updatedAt: true,
    },
  });

  // =========================
  // DELETE OLD IMAGE
  // =========================

  if (data.imageUrl && data.imageUrl !== user.imageUrl) {
    await deleteUserImage(user.imageUrl);
  }

  return updatedUser;
}

// =========================
// SOFT DELETE USER
// =========================

export async function deleteUser(id: string, userId: string) {
  const user = await prisma.user.update({
    where: {
      id,
    },

    data: {
      isActive: false,
    },

    select: {
      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      updatedAt: true,
    },
  });

  await createAuditLog({
    userId,

    action: "DELETE",

    module: "USER",

    description: `Menonaktifkan user ${user.email}`,
  });

  return user;
}

// =========================
// UPDATE USER STATUS
// =========================

export async function updateUserStatus(id: string, isActive: boolean) {
  return await prisma.user.update({
    where: {
      id,
    },

    data: {
      isActive,
    },

    select: {
      id: true,

      name: true,

      email: true,

      role: true,

      isActive: true,

      updatedAt: true,
    },
  });
}
