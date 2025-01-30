"use server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import * as jose from "jose";

// Create JWT token using jose
async function createToken(payload: { userId: number; username: string; role: string }) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return await new jose.SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(secret);
}

// Verify JWT token using jose
async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jose.jwtVerify(token, secret);
  return payload;
}

export async function Register(username: string, password: string, level: string) {
  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      return { status: "Failed", message: "User already exists", code: 400 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword, level },
    });

    return { status: "Success", data: user, code: 200 };
  } catch (error) {
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

export async function Login(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { status: "Failed", message: "User tidak ditemukan", code: 404 };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return { status: "Failed", message: "Password salah", code: 401 };
    }

    const token = await createToken({
      userId: user.id,
      username: user.username,
      role: user.level.toUpperCase(),
    });

    // Fix: await the cookies() call
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return {
      status: "Success",
      data: { 
        user: {
          ...user,
          role: user.level.toUpperCase()
        }
      },
      code: 200,
    };
  } catch (error) {
    console.error("Login error:", error);
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

export async function Logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return {
      status: "Success",
      message: "Berhasil logout",
      code: 200,
    };
  } catch (error) {
    console.error("Error saat logout:", `${error}`);
    return {
      status: "Failed",
      message: "Gagal logout",
      code: 500,
    };
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyToken(token.value);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as number },
      select: {
        id: true,
        username: true,
        level: true,
      },
    });
    return user;
  } catch (error) {
    if (error) {
      return null;
    }
  }
}

export async function addUsers(username: string, password: string, level: string) {
  try {
    const userExists = await prisma.user.findUnique({
      where: { username },
    });

    if (userExists) {
      return { status: "Failed", message: "User already exists", code: 400 };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword, level },
    });

    return { status: "Success", data: user, code: 200 };
  } catch (error) {
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      level: true,
    },
  });

  return users;
}

export async function deleteUser(id: number) {
  try {
    const user = await prisma.user.delete({
      where: { id },
    });

    return { status: "Success", data: user, code: 200 };
  } catch (error) {
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

export async function updateUser(id: number, username: string, level: string) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { username, level },
    });

    return { status: "Success", data: user, code: 200 };
  } catch (error) {
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

export const addProduct = async (namaProduk: string, harga: number, stok: number) => {
  console.log("server :",namaProduk, harga, stok);
  try {
    const product = await prisma.produk.create({
      data: { 
        namaProduk, 
        harga: Number(harga), // Pastikan nilai number
        stok: Number(stok) 
      },
    });

    return { 
      status: "Success", 
      data: product, 
      code: 200 
    };
  } catch (error) {
    console.error("Database Error:", error); // Log error untuk debugging
    return { 
      status: "Failed", 
      message: "Gagal menambahkan produk", 
      code: 500 
    };
  }
};


export async function getProducts() {
  const products = await prisma.produk.findMany({
    select: {
      produkId: true,
      namaProduk: true,
      harga: true,
      stok: true,
    },
  });

  return products;
}

export async function updateProduct(produkId: number, namaProduk: string, harga: number, stok: number) {
  try {
    const product = await prisma.produk.update({
      where: { produkId },
      data: { namaProduk, harga, stok },
    });

    return { status: "Success", data: product, code: 200 };
  } catch (error) {
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

export async function deleteProduct(id: number) {
  try {
    const product = await prisma.produk.delete({
      where: { produkId: id },
    });

    return { status: "Success", data: product, code: 200 };
  } catch (error) {
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

export const addPelanggan = async (namaPelanggan: string, alamat: string, nomorTelepon: number) => {
  try {
    const pelanggan = await prisma.pelanggan.create({
      data: { 
        namaPelanggan, 
        alamat, 
        nomorTelepon 
      },
    });

    return { 
      status: "Success", 
      data: pelanggan, 
      code: 200 
    };
  } catch (error) {
    console.error("Database Error:", error);
    return { 
      status: "Failed", 
      message: "Gagal menambahkan pelanggan", 
      code: 500 
    };
  }
};

export async function getPelanggans() {
  const pelanggans = await prisma.pelanggan.findMany({
    select: {
      pelangganId: true,
      namaPelanggan: true,
      alamat: true,
      nomorTelepon: true,
    },
  });

  return pelanggans;
}

export async function updatePelanggan(pelangganId: number, namaPelanggan: string, alamat: string, nomorTelepon: number) {
  try {
    const pelanggan = await prisma.pelanggan.update({
      where: { pelangganId },
      data: { namaPelanggan, alamat, nomorTelepon },
    });

    return { status: "Success", data: pelanggan, code: 200 };
  } catch (error) {
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

export async function deletePelanggan(id: number) {
  try {
    const pelanggan = await prisma.pelanggan.delete({
      where: { pelangganId: id },
    });

    return { status: "Success", data: pelanggan, code: 200 };
  } catch (error) {
    return { status: "Failed", message: `${error}`, code: 500 };
  }
}

