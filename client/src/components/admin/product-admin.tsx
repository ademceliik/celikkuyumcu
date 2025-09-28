import React, { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  weight: string;
  goldKarat: number;
  imageUrl: string;
  isActive: string;
  hasWorkmanship: string;
}

const ProductAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setError("Ürünler alınamadı"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Ürün Yönetimi</h2>
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Fotoğraf</th>
            <th className="p-2">İsim</th>
            <th className="p-2">Kategori</th>
            <th className="p-2">Gram</th>
            <th className="p-2">Ayar</th>
            <th className="p-2">İşçilik</th>
            <th className="p-2">Durum</th>
            <th className="p-2">İşlem</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b">
              <td className="p-2"><img src={product.imageUrl} alt={product.name} className="w-16 h-12 object-cover rounded" /></td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.category}</td>
              <td className="p-2">{product.weight}</td>
              <td className="p-2">{product.goldKarat}</td>
              <td className="p-2">{product.hasWorkmanship === "true" ? "İşçilikli" : "İşçiliksiz"}</td>
              <td className="p-2">{product.isActive === "true" ? "Aktif" : "Pasif"}</td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">Düzenle</button>
                <button className="text-red-600 hover:underline">Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Ürün ekleme ve düzenleme formları buraya eklenecek */}
    </div>
  );
};

export default ProductAdmin;
