import React, { useEffect, useState } from "react";
import ProductForm from "./product-form";
import { Button } from "@/components/ui/button";

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
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(() => setError("Ürünler alınamadı"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchProducts, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Ürün Yönetimi</h2>
        <Button onClick={() => { setEditProduct(null); setShowForm(true); }} variant="default">Yeni Ürün Ekle</Button>
      </div>
      {showForm && (
        <div className="mb-6">
          <ProductForm
            product={editProduct}
            onClose={() => { setShowForm(false); setEditProduct(null); fetchProducts(); }}
          />
        </div>
      )}
      {loading && <div>Yükleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="overflow-x-auto">
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
                <td className="p-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditProduct(product); setShowForm(true); }}>Düzenle</Button>
                  <Button size="sm" variant="destructive" onClick={async () => {
                    // Önce Uploadcare görselini sil
                    try {
                      const match = product.imageUrl.match(/ucarecdn.com\/(.*)\//);
                      if (match && match[1]) {
                        const fileId = match[1];
                        // .env'den anahtarları al
                        const pubKey = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY;
                        const secKey = import.meta.env.VITE_UPLOADCARE_SECRET_KEY;
                        if (pubKey && secKey) {
                          await fetch(`https://api.uploadcare.com/files/${fileId}/`, {
                            method: "DELETE",
                            headers: {
                              "Authorization": `Uploadcare.Simple ${pubKey}:${secKey}`,
                            },
                          });
                        }
                      }
                    } catch (err) {
                      // Silme başarısız olsa da devam et
                    }
                    await fetch(`/api/products/${product.id}`, { method: "DELETE" });
                    fetchProducts();
                  }}>Sil</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductAdmin;
