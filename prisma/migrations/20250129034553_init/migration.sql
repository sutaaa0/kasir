-- CreateTable
CREATE TABLE "tesProduk" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "harga" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL,

    CONSTRAINT "tesProduk_pkey" PRIMARY KEY ("id")
);
