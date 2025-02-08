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
        imgUrl: "",
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

export const addPelanggan = async (namaPelanggan: string, alamat: string, nomorTelepon: string) => {
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

export async function updatePelanggan(pelangganId: number, namaPelanggan: string, alamat: string, nomorTelepon: string) {
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



export type CartItem = {
  produkId: number;
  quantity: number;
};

export async function getProductsForKasir() {
  try {
    const products = await prisma.produk.findMany();
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getCustomers() {
  try {
    const customers = await prisma.pelanggan.findMany();
    return customers;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw new Error("Failed to fetch customers");
  }
}

export async function createCustomer(
  namaPelanggan: string,
  alamat: string,
  nomorTelepon: string
) {
  try {
    const newCustomer = await prisma.pelanggan.create({
      data: {
        namaPelanggan,
        alamat,
        nomorTelepon,
      },
    });
    return newCustomer;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw new Error("Failed to create customer");
  }
}

export async function createTransaction(
  pelangganId: number,
  items: CartItem[],
  total: number,
  payment: number,
  change: number
) {
  try {
    // Validasi stok produk terlebih dahulu
    for (const item of items) {
      const product = await prisma.produk.findUnique({
        where: { produkId: item.produkId },
      });
      if (!product || product.stok < item.quantity) {
        throw new Error(`Stok tidak mencukupi untuk ${product?.namaProduk}`);
      }
    }

    const transaction = await prisma.$transaction(async (tx) => {
      // Buat data Penjualan dengan tambahan uang pembayaran dan kembalian
      const penjualan = await tx.penjualan.create({
        data: {
          tanggalPenjualan: new Date(),
          totalHarga: total,
          uangPembayaran: payment,
          kembalian: change,
          pelangganId: pelangganId,
        },
      });

      // Buat data DetailPenjualan dan update stok produk
      for (const item of items) {
        const product = await tx.produk.findUnique({
          where: { produkId: item.produkId },
        });

        if (!product) continue;

        await tx.detailPenjualan.create({
          data: {
            penjualanId: penjualan.penjualanId,
            produkId: item.produkId,
            jumlahProduk: item.quantity,
            subtotal: product.harga * item.quantity,
          },
        });

        await tx.produk.update({
          where: { produkId: item.produkId },
          data: { stok: { decrement: item.quantity } },
        });
      }

      return penjualan;
    });

    return transaction;
  } catch (error) {
    throw new Error(
      `Transaction failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function getPurchases() {
  try {
    const purchases = await prisma.penjualan.findMany({
      include: {
        pelanggan: true,
        detailPenjualan: {
          include: {
            produk: true,
          },
        },
      },
    });

    // Transformasikan data agar sesuai dengan tipe Purchase yang digunakan di client
    const transformed = purchases.map((purchase) => ({
      id: purchase.penjualanId,
      date: purchase.tanggalPenjualan.toISOString().split("T")[0], // format YYYY-MM-DD
      customer: purchase.pelanggan.namaPelanggan,
      total: purchase.totalHarga,
      details: (Array.isArray(purchase.detailPenjualan) ? purchase.detailPenjualan : [purchase.detailPenjualan]).map((detail) => ({
        productId: detail.produkId,
        productName: detail.produk.namaProduk,
        quantity: detail.jumlahProduk,
        price: detail.produk.harga,
        subtotal: detail.subtotal,
      })),
    }));

    return transformed;
  } catch (error) {
    console.error("Error fetching purchases:", error);
    throw new Error("Failed to fetch purchases");
  }
}
