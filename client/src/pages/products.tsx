import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import { type Product } from "@shared/schema";
import { JEWELRY_CATEGORIES } from "@/lib/constants";

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = [
    { key: "all", label: "Tümü" },
    ...Object.entries(JEWELRY_CATEGORIES).map(([key, label]) => ({ key, label }))
  ];

  return (
    <section className="py-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-products-title">
            Ürün Kataloğu
          </h2>
          <p className="text-xl text-muted-foreground mb-8" data-testid="text-products-subtitle">
            Geniş altın takı koleksiyonumuzu keşfedin
          </p>
          
          {/* Product Categories Filter */}
          <div className="flex flex-wrap gap-4 mb-8" data-testid="filter-categories">
            {categories.map((category) => (
              <Button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                variant={selectedCategory === category.key ? "default" : "secondary"}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedCategory === category.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
                data-testid={`button-filter-${category.key}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-products-loading">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16" data-testid="empty-products">
            <i className="fas fa-gem text-6xl text-muted-foreground mb-4"></i>
            <h3 className="text-2xl font-semibold text-foreground mb-2">Ürün Bulunamadı</h3>
            <p className="text-muted-foreground">
              Seçilen kategoride ürün bulunmamaktadır. Lütfen başka bir kategori seçin.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-products">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
