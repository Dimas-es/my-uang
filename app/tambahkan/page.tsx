import { fetchCategoryOptions } from "@/lib/categories";
import { TambahkanForm } from "@/app/tambahkan/TambahkanForm";

export default async function TambahkanPage() {
  const categories = await fetchCategoryOptions();
  return <TambahkanForm categories={categories} />;
}
