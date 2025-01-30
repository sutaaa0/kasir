/*
  Warnings:

  - You are about to drop the column `detailId` on the `Produk` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Produk" DROP CONSTRAINT "Produk_detailId_fkey";

-- AlterTable
ALTER TABLE "Produk" DROP COLUMN "detailId";

-- AddForeignKey
ALTER TABLE "DetailPenjualan" ADD CONSTRAINT "DetailPenjualan_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("produkId") ON DELETE RESTRICT ON UPDATE CASCADE;
