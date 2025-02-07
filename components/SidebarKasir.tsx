"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { BarChart, FileText, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "./ui/container";

const Sidebar = () => {
  // Set initial state to false so sidebar starts closed
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button - Always visible */}
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed top-4 left-4 z-20 p-2"
        variant="outline"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Sidebar Container with transition */}
      <div 
        className={`fixed left-0 top-0 h-full z-10 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Container className="w-64 h-full bg-secondary p-4 pt-16">
          <nav className="space-y-2">
            <Link href="/kasir/transaksi" className="w-full">
              <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
                <ShoppingBag className="w-5 h-5 mr-4" />
                <span className="flex-grow text-left">Transaksi</span>
              </Button>
            </Link>
            <Link href="/kasir/produk" className="w-full">
              <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
                <ShoppingBag className="w-5 h-5 mr-4" />
                <span className="flex-grow text-left">Barang</span>
              </Button>
            </Link>
            <Link href="/kasir/laporan" className="w-full">
              <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
                <BarChart className="w-5 h-5 mr-4" />
                <span className="flex-grow text-left">Laporan Penjualan</span>
              </Button>
            </Link>
            <Link href="/kasir/riwayat" className="w-full">
              <Button className="w-full bg-white hover:bg-primary justify-start px-4 py-3">
                <FileText className="w-5 h-5 mr-4" />
                <span className="flex-grow text-left">Riwayat Pembelian</span>
              </Button>
            </Link>
          </nav>
        </Container>
      </div>
    </>
  );
};

export default Sidebar;