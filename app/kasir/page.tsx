"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createTransaction, createCustomer, getProductsForKasir, getCustomers, type CartItem as ServerCartItem, getCurrentUser, Logout } from "@/server/actions";
import { redirect, useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Product {
  produkId: number;
  namaProduk: string;
  harga: number;
  stok: number;
  imgUrl: string;
}

interface ClientCartItem extends Product {
  quantity: number;
}

interface Pelanggan {
  pelangganId: number;
  namaPelanggan: string;
  alamat: string;
  nomorTelepon: string;
}

interface ReceiptData {
  customerName: string;
  items: ClientCartItem[];
  total: number;
  payment: number;
  change: number;
}

export default function TransaksiPage() {
  const [serverProducts, setServerProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Pelanggan[]>([]);
  const [cart, setCart] = useState<ClientCartItem[]>([]);
  const [selectedPelangganId, setSelectedPelangganId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        redirect("/login");
      } else if (currentUser.level === "ADMIN") {
        redirect("/dashboard");
      }
    };
    fetchCurrentUser();
  }, []);

  // Load produk dari database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProductsForKasir();
        setServerProducts(products);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  

  // Load pelanggan dari database
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customersData = await getCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error("Error loading customers:", error);
      }
    };
    loadCustomers();
  }, []);

  const refreshCustomers = async () => {
    try {
      const customersData = await getCustomers();
      setCustomers(customersData);
    } catch (error) {
      console.error("Error refreshing customers:", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.produkId === product.produkId);
      if (existingItem) {
        return currentCart.map((item) => (item.produkId === product.produkId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((currentCart) => currentCart.map((item) => (item.produkId === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item)).filter((item) => item.quantity > 0));
  };

  // Total tanpa pajak
  const total = cart.reduce((sum, item) => sum + item.harga * item.quantity, 0);

  const handleCheckout = async () => {
    if (!selectedPelangganId) {
      alert("Pilih pelanggan terlebih dahulu");
      return;
    }

    const payment = Number.parseFloat(paymentAmount);
    if (isNaN(payment)) {
      alert("Masukkan jumlah uang pembayaran yang valid");
      return;
    }

    if (payment < total) {
      alert("Uang pembayaran tidak mencukupi");
      return;
    }

    try {
      const serverCart: ServerCartItem[] = cart.map((item) => ({
        produkId: item.produkId,
        quantity: item.quantity,
      }));

      const change = payment - total;

      // Simpan transaksi beserta data uang pembayaran dan kembalian ke database
      await createTransaction(selectedPelangganId, serverCart, total, payment, change);

      // Buat data nota pembayaran
      const selectedCustomer = customers.find((customer) => customer.pelangganId === selectedPelangganId);
      const receiptData: ReceiptData = {
        customerName: selectedCustomer ? selectedCustomer.namaPelanggan : "Unknown",
        items: cart,
        total: total,
        payment: payment,
        change: change,
      };

      setReceipt(receiptData);
      setCart([]);
      setPaymentAmount("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Transaksi gagal");
    }
  };

  const handleCreateCustomer = async () => {
    if (!newCustomerName || !newCustomerAddress || !newCustomerPhone) {
      alert("Semua field wajib diisi");
      return;
    }
    try {
      const newCustomer = await createCustomer(newCustomerName, newCustomerAddress, newCustomerPhone);
      // Perbarui daftar pelanggan dan set pelanggan baru sebagai terpilih
      await refreshCustomers();
      setSelectedPelangganId(newCustomer.pelangganId);
      setNewCustomerName("");
      setNewCustomerAddress("");
      setNewCustomerPhone("");
      setNewCustomerModalOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menambahkan pelanggan");
    }
  };

  const handleLogout = async () => {
    try {
      const log = await Logout();

      if (log.status === "Success") {
        toast({
          title: "Logout Berhasil",
          description: "Anda telah keluar",
        });

        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      if (error) {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat logout",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex h-full gap-6">
      <Button onClick={() => handleLogout()} className="fixed top-4 right-4 bg-red-500 text-white font-bold text-xl tracking-widest py-2 px-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
        Logout
      </Button>

      {/* Section Produk */}
      <div className="flex-1">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serverProducts.map((product) => (
              <div key={product.produkId} className="border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all">
                <div className="aspect-square bg-gray-200 mb-4">
                  {product.imgUrl ? (
                    <Image width={200} height={200} src={product.imgUrl || "/placeholder.svg"} alt={product.namaProduk} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black font-bold">NO IMAGE</div>
                  )}
                </div>
                <h3 className="font-bold mb-2 text-lg">{product.namaProduk}</h3>
                <div className="flex justify-between items-center">
                  <p className="font-mono text-xl">Rp {product.harga.toLocaleString()}</p>
                  <Button onClick={() => addToCart(product)} className="border-4 border-black bg-white font-bold">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* Section Keranjang, Input Uang, dan Checkout */}
      <Container className="w-[400px] h-full flex flex-col">
        <h2 className="text-3xl font-bold mb-4 flex items-center gap-2 tracking-widest">
          <ShoppingCart className="w-8 h-8" />
          Order Summary
        </h2>

        {/* Dropdown Pemilihan Pelanggan dengan gaya neo brutalism */}
        <div className="mb-4">
          <label htmlFor="customer-select" className="block text-lg font-bold text-black border-b-4 border-black pb-1">
            Pilih Pelanggan
          </label>
          <div className="flex gap-2">
            <select id="customer-select" className="mt-2 w-full p-2 bg-gray-100 border-4 border-black font-bold text-xl tracking-widest" value={selectedPelangganId || ""} onChange={(e) => setSelectedPelangganId(Number(e.target.value))}>
              <option value="" disabled>
                -- Pilih Pelanggan --
              </option>
              {customers.map((customer) => (
                <option key={customer.pelangganId} value={customer.pelangganId}>
                  {customer.namaPelanggan}
                </option>
              ))}
            </select>
            <Button onClick={() => setNewCustomerModalOpen(true)} className="mt-2 border-4 border-black bg-white font-bold text-xl px-2">
              +
            </Button>
          </div>
        </div>

        {/* Daftar Produk di Keranjang */}
        <div className="flex-1 overflow-auto">
          {cart.map((item) => (
            <div key={item.produkId} className="flex justify-between items-center py-2 border-b-4 border-black my-2">
              <div>
                <h3 className="font-bold text-xl">{item.namaProduk}</h3>
                <p className="text-lg font-mono">Rp {item.harga.toLocaleString()}</p>
                <p className="text-sm font-bold">Jumlah: {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => removeFromCart(item.produkId)} className="border-4 border-black">
                  <Minus className="w-5 h-5" />
                </Button>
                <span className="w-10 text-center font-bold text-xl">{item.quantity}</span>
                <Button size="sm" variant="outline" onClick={() => addToCart(item)} className="border-4 border-black">
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Input Uang Pembayaran */}
        <div className="mt-4">
          <label htmlFor="payment" className="block text-lg font-bold text-black border-b-4 border-black pb-1">
            Uang Pembayaran
          </label>
          <input
            type="number"
            id="payment"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Masukkan jumlah uang"
            className="mt-2 w-full p-2 bg-white border-4 border-black font-bold text-xl tracking-widest"
          />
        </div>

        {/* Ringkasan Pembayaran */}
        <div className="border-t-4 border-black pt-4 mt-4">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-xl">Subtotal</span>
            <span className="font-mono text-xl">Rp {total.toLocaleString()}</span>
          </div>
          <Button onClick={handleCheckout} className="w-full bg-black text-white font-bold text-xl tracking-widest py-2 border-4 border-black hover:bg-black/80">
            Confirm Payment
          </Button>
        </div>
      </Container>

      {/* Modal Nota Pembayaran dengan gaya neo brutalism */}
      <Transition appear show={!!receipt} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setReceipt(null)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-90" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-90">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded border-8 border-black bg-yellow-300 p-6 text-left align-middle shadow-[8px_8px_0px_0px_black] transition-all">
                  <Dialog.Title className="text-3xl font-bold tracking-widest text-black mb-4">NOTA PEMBAYARAN</Dialog.Title>
                  <div className="space-y-2">
                    <p className="text-xl">
                      <strong>Nama Pembeli:</strong> {receipt?.customerName}
                    </p>
                    <div>
                      <strong className="text-xl">Detail Produk:</strong>
                      <ul className="list-disc ml-5 text-lg">
                        {receipt?.items.map((item) => (
                          <li key={item.produkId}>
                            {item.namaProduk} - Jumlah: {item.quantity} - Harga: Rp {(item.harga * item.quantity).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-xl">
                      <strong>Total Harga:</strong> Rp {receipt?.total.toLocaleString()}
                    </p>
                    <p className="text-xl">
                      <strong>Uang Pembayaran:</strong> Rp {receipt?.payment.toLocaleString()}
                    </p>
                    <p className="text-xl">
                      <strong>Kembalian:</strong> Rp {receipt?.change.toLocaleString()}
                    </p>
                  </div>
                  <div className="mt-6">
                    <Button onClick={() => setReceipt(null)} className="w-full bg-black text-white font-bold text-xl tracking-widest py-2 border-4 border-black hover:bg-black/80">
                      Close
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal Tambah Pelanggan Baru */}
      <Transition appear show={newCustomerModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setNewCustomerModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-90" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-90">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded border-8 border-black bg-yellow-300 p-6 text-left align-middle shadow-[8px_8px_0px_0px_black] transition-all">
                  <Dialog.Title className="text-3xl font-bold tracking-widest text-black mb-4">TAMBAH PELANGGAN</Dialog.Title>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xl font-bold text-black">Nama Pelanggan</label>
                      <input
                        type="text"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        className="mt-1 w-full p-2 bg-white border-4 border-black font-bold text-xl tracking-widest"
                        placeholder="Masukkan nama pelanggan"
                      />
                    </div>
                    <div>
                      <label className="block text-xl font-bold text-black">Alamat</label>
                      <input
                        type="text"
                        value={newCustomerAddress}
                        onChange={(e) => setNewCustomerAddress(e.target.value)}
                        className="mt-1 w-full p-2 bg-white border-4 border-black font-bold text-xl tracking-widest"
                        placeholder="Masukkan alamat"
                      />
                    </div>
                    <div>
                      <label className="block text-xl font-bold text-black">Nomor Telepon</label>
                      <input
                        type="text"
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value)}
                        className="mt-1 w-full p-2 bg-white border-4 border-black font-bold text-xl tracking-widest"
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    <Button onClick={handleCreateCustomer} className="w-full bg-black text-white font-bold text-xl tracking-widest py-2 border-4 border-black hover:bg-black/80">
                      Simpan
                    </Button>
                    <Button onClick={() => setNewCustomerModalOpen(false)} className="w-full bg-gray-700 text-white font-bold text-xl tracking-widest py-2 border-4 border-black hover:bg-gray-600">
                      Batal
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
