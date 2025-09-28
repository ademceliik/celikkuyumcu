import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Product } from "@shared/schema";
import { JEWELRY_CATEGORIES, GOLD_KARATS } from "@/lib/constants";
import ProductForm from "@/components/admin/product-form";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Admin() {
  useDocumentTitle("Çelik Kuyumcu | Admin");
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi.",
      });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="admin-sidebar fixed left-0 top-0 h-full w-64 text-secondary-foreground p-6 z-40">
        <div className="flex items-center mb-8">
          <i className="fas fa-cog text-2xl mr-3"></i>
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        
        <nav className="space-y-4">
          <div className="flex items-center p-3 rounded-lg bg-white/10 text-white">
            <i className="fas fa-gem mr-3"></i>
            Ürün Yönetimi
          </div>
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
            <i className="fas fa-list mr-3"></i>
            Kategoriler
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
            <i className="fas fa-chart-bar mr-3"></i>
            Raporlar
          </a>
          <a href="#" className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors opacity-50 cursor-not-allowed">
            <i className="fas fa-cog mr-3"></i>
            Ayarlar
          </a>
        </nav>
      </div>
      
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-foreground" data-testid="text-admin-title">
            Ürün Yönetimi
          </h3>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                data-testid="button-add-product"
                onClick={() => setEditingProduct(null)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Ürün Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                </DialogTitle>
              </DialogHeader>
              <ProductForm 
                product={editingProduct} 
                onClose={handleFormClose}
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card className="shadow-lg" data-testid="card-admin-products">
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-products"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[200px]" data-testid="select-category-filter">
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Kategoriler</SelectItem>
                  {Object.entries(JEWELRY_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="table-products">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Ürün</th>
                    <th className="text-left p-4 font-semibold">Kategori</th>
                    <th className="text-left p-4 font-semibold">Gram</th>
                    <th className="text-left p-4 font-semibold">Ayar</th>
                    <th className="text-left p-4 font-semibold">Durumu</th>
                    <th className="text-left p-4 font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr data-testid="row-no-products">
                      <td colSpan={6} className="p-8 text-center text-muted-foreground">
                        {searchTerm || categoryFilter !== "all" ? "Kriterlere uygun ürün bulunamadı." : "Henüz ürün bulunmamaktadır."}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr 
                        key={product.id} 
                        className="border-b border-border hover:bg-muted/50"
                        data-testid={`row-product-${product.id}`}
                      >
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-12 h-12 rounded object-cover"
                              data-testid={`img-product-table-${product.id}`}
                            />
                            <span data-testid={`text-product-name-table-${product.id}`}>
                              {product.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4" data-testid={`text-product-category-table-${product.id}`}>
                          {JEWELRY_CATEGORIES[product.category as keyof typeof JEWELRY_CATEGORIES]}
                        </td>
                        <td className="p-4" data-testid={`text-product-weight-table-${product.id}`}>
                          {product.weight}
                        </td>
                        <td className="p-4" data-testid={`text-product-karat-table-${product.id}`}>
                          {product.goldKarat} Ayar
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={product.isActive === "true" ? "default" : "secondary"}
                            className={product.isActive === "true" ? "bg-green-100 text-green-800" : ""}
                            data-testid={`badge-product-status-${product.id}`}
                          >
                            {product.isActive === "true" ? "Aktif" : "Pasif"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 hover:text-blue-800"
                              data-testid={`button-edit-${product.id}`}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-800"
                              disabled={deleteMutation.isPending}
                              data-testid={`button-delete-${product.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
