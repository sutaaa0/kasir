/*
  Warnings:

  - Added the required column `imgUrl` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Produk" ADD COLUMN     "imgUrl" TEXT NOT NULL;
