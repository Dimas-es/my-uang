import type { Transaction } from "@/app/types";
import type { IconKey } from "@/lib/iconMap";

export type CategorySeed = {
  id: string;
  label: string;
  icon: IconKey;
  iconBg: string;
  flow: Transaction["type"];
};

export const defaultCategories: CategorySeed[] = [
  { id: "belanja", label: "Belanja", icon: "FiShoppingCart", iconBg: "bg-rose-500", flow: "expense" },
  { id: "makanan", label: "Makanan", icon: "FiCoffee", iconBg: "bg-amber-500", flow: "expense" },
  { id: "telepon", label: "Telepon", icon: "FiPhone", iconBg: "bg-sky-500", flow: "expense" },
  { id: "hiburan", label: "Hiburan", icon: "FiMonitor", iconBg: "bg-violet-500", flow: "expense" },
  { id: "pendidikan", label: "Pendidikan", icon: "FiBook", iconBg: "bg-indigo-500", flow: "expense" },
  { id: "kecantikan", label: "Kecantikan", icon: "FiScissors", iconBg: "bg-pink-500", flow: "expense" },
  { id: "olahraga", label: "Olahraga", icon: "FiActivity", iconBg: "bg-green-500", flow: "expense" },
  { id: "sosial", label: "Sosial", icon: "FiUsers", iconBg: "bg-cyan-500", flow: "expense" },
  { id: "transportasi", label: "Transportasi", icon: "FiTruck", iconBg: "bg-emerald-500", flow: "expense" },
  { id: "pakaian", label: "Pakaian", icon: "FiShoppingBag", iconBg: "bg-blue-500", flow: "expense" },
  { id: "mobil", label: "Mobil", icon: "FiNavigation", iconBg: "bg-orange-500", flow: "expense" },
  { id: "minuman", label: "Minuman", icon: "FiDroplet", iconBg: "bg-lime-500", flow: "expense" },
  { id: "rokok", label: "Rokok", icon: "FiZap", iconBg: "bg-yellow-500", flow: "expense" },
  { id: "elektronik", label: "Elektronik", icon: "FiHardDrive", iconBg: "bg-fuchsia-500", flow: "expense" },
  { id: "bepergian", label: "Bepergian", icon: "FiSend", iconBg: "bg-teal-500", flow: "expense" },
  { id: "kesehatan", label: "Kesehatan", icon: "FiHeart", iconBg: "bg-red-500", flow: "expense" },
  { id: "peliharaan", label: "Peliharaan", icon: "FiHome", iconBg: "bg-slate-500", flow: "expense" },
  { id: "perbaikan", label: "Perbaikan", icon: "FiTool", iconBg: "bg-stone-500", flow: "expense" },
  { id: "perumahan", label: "Perumahan", icon: "FiHome", iconBg: "bg-neutral-500", flow: "expense" },
  { id: "rumah", label: "Rumah", icon: "FiHome", iconBg: "bg-gray-500", flow: "expense" },
  { id: "hadiah", label: "Hadiah", icon: "FiGift", iconBg: "bg-purple-500", flow: "expense" },
  { id: "donasi", label: "Donasi", icon: "FiDollarSign", iconBg: "bg-amber-600", flow: "expense" },
  { id: "lotre", label: "Lotre", icon: "FiGrid", iconBg: "bg-cyan-600", flow: "expense" },
  { id: "makanan-ringan", label: "Makanan ringan", icon: "FiStar", iconBg: "bg-pink-600", flow: "expense" },
  { id: "anak-anak", label: "Anak-anak", icon: "FiUser", iconBg: "bg-emerald-600", flow: "expense" },
  { id: "sayur-mayur", label: "Sayur-mayur", icon: "FiPackage", iconBg: "bg-lime-600", flow: "expense" },
  { id: "buah", label: "Buah", icon: "FiTarget", iconBg: "bg-orange-600", flow: "expense" },
  { id: "pengaturan", label: "Pengaturan", icon: "FiSettings", iconBg: "bg-blue-600", flow: "expense" },
  { id: "gaji", label: "Gaji", icon: "FiDollarSign", iconBg: "bg-emerald-400", flow: "income" },
  { id: "bonus", label: "Bonus", icon: "FiGift", iconBg: "bg-purple-400", flow: "income" },
  { id: "investasi", label: "Investasi", icon: "FiActivity", iconBg: "bg-sky-400", flow: "income" },
  { id: "bisnis", label: "Bisnis", icon: "FiShoppingCart", iconBg: "bg-rose-400", flow: "income" },
];


