/*
  Warnings:

  - Changed the type of `nomorTelepon` on the `Pelanggan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Pelanggan" DROP COLUMN "nomorTelepon",
ADD COLUMN     "nomorTelepon" INTEGER NOT NULL;
