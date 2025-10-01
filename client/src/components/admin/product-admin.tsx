import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ProductForm from "./product-form";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

const ProductAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const [showForm, setShowForm] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isError) {
      setError("Urunler alinamadi");
    }
  }, [isError]);

  async function handleDelete(product: Product) {
    // Uploadcare dosyasini temizlemeyi dene
    try {
      const match = product.imageUrl.match(/ucarecdn.com\/(.*?)(?:\/|$)/);
      if (match && match[1]) {
        const fileId = match[1];
        const pubKey = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY;
        const secKey = import.meta.env.VITE_UPLOADCARE_SECRET_KEY;
        if (pubKey && secKey) {
          await fetch(`https://api.uploadcare.com/files/${fileId}/`, {
            method: "DELETE",
            headers: {
              Authorization: `Uploadcare.Simple ${pubKey}:${secKey}`,
            },
          });
        }
      }
    } catch (err) {
      // Uploadcare silme hatasi kritik degil
    }

    await apiRequest("DELETE", `/api/products/${product.id}`);
    queryClient.invalidateQueries({ queryKey: ["/api/products"] });
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditProduct(null);
    queryClient.invalidateQueries({ queryKey: ["/api/products"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Urun Yonetimi</h2>
        <Button
          onClick={() => {
            setEditProduct(null);
            setShowForm(true);
          }}
          variant="default"
        >
          Yeni Urun Ekle
        </Button>
      </div>
      {showForm && (
        <div className="mb-6">
          <ProductForm product={editProduct} onClose={handleCloseForm} />
        </div>
      )}
      {isLoading && <div>Yukleniyor...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Fotograf</th>
              <th className="p-2">Isim</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Gram</th>
              <th className="p-2">Ayar</th>
              <th className="p-2">Iscilik</th>
              <th className="p-2">Durum</th>
              <th className="p-2">Islem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-2">
                  <img src={product.imageUrl} alt={product.name} className="w-16 h-12 object-cover rounded" />
                </td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.category}</td>
                <td className="p-2">{product.weight}</td>
                <td className="p-2">{product.goldKarat}</td>
                <td className="p-2">{product.hasWorkmanship === "true" ? "Iscilikli" : "Isciliksiz"}</td>
                <td className="p-2">{product.isActive === "true" ? "Aktif" : "Pasif"}</td>
                <td className="p-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditProduct(product);
                      setShowForm(true);
                    }}
                  >
                    Duzenle
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(product)}>
                    Sil
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && !isLoading && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-muted-foreground">
                  Henuz urun yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductAdmin;
