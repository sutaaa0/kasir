-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pelanggan" (
    "pelangganId" SERIAL NOT NULL,
    "namaPelanggan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "nomorTelepon" INTEGER NOT NULL,

    CONSTRAINT "Pelanggan_pkey" PRIMARY KEY ("pelangganId")
);

-- CreateTable
CREATE TABLE "Penjualan" (
    "penjualanId" SERIAL NOT NULL,
    "tanggalPenjualan" TIMESTAMP(3) NOT NULL,
    "totalHarga" DOUBLE PRECISION NOT NULL,
    "pelangganId" INTEGER NOT NULL,

    CONSTRAINT "Penjualan_pkey" PRIMARY KEY ("penjualanId")
);

-- CreateTable
CREATE TABLE "DetailPenjualan" (
    "detailId" SERIAL NOT NULL,
    "penjualanId" INTEGER NOT NULL,
    "produkId" INTEGER NOT NULL,
    "jumlahProduk" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "DetailPenjualan_pkey" PRIMARY KEY ("detailId")
);

-- CreateTable
CREATE TABLE "Produk" (
    "produkId" SERIAL NOT NULL,
    "namaProduk" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,
    "detailId" INTEGER NOT NULL,

    CONSTRAINT "Produk_pkey" PRIMARY KEY ("produkId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "DetailPenjualan_penjualanId_key" ON "DetailPenjualan"("penjualanId");

-- AddForeignKey
ALTER TABLE "Penjualan" ADD CONSTRAINT "Penjualan_pelangganId_fkey" FOREIGN KEY ("pelangganId") REFERENCES "Pelanggan"("pelangganId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_penjualanId_fkey" FOREIGN KEY ("penjualanId") REFERENCES "Penjualan"("penjualanId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produk" ADD CONSTRAINT "Produk_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "DetailPenjualan"("detailId") ON DELETE RESTRICT ON UPDATE CASCADE;
