/*
  Warnings:

  - Added the required column `kembalian` to the `Penjualan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uangPembayaran` to the `Penjualan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Penjualan" ADD COLUMN     "kembalian" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "uangPembayaran" DOUBLE PRECISION NOT NULL;
