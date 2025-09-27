import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Product } from "@shared/schema";
import { JEWELRY_CATEGORIES, WHATSAPP_PHONE } from "@/lib/constants";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const handleWhatsAppOrder = () => {
    const message = `Merhaba! ${product.name} hakkında bilgi almak istiyorum. (${product.weight} gram, ${product.goldKarat} ayar)`;
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className={`product-card bg-card rounded-xl shadow-lg overflow-hidden ${className}`} data-testid={`card-product-${product.id}`}>
      <img 
        src={product.imageUrl} 
        alt={product.name}
        className="w-full h-64 object-cover"
        data-testid={`img-product-${product.id}`}
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-xl font-semibold text-foreground" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h4>
          <Badge variant="secondary" data-testid={`badge-category-${product.id}`}>
            {JEWELRY_CATEGORIES[product.category as keyof typeof JEWELRY_CATEGORIES]}
          </Badge>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground" data-testid={`text-weight-${product.id}`}>
            {product.weight} gram
          </span>
          <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded" data-testid={`text-karat-${product.id}`}>
            {product.goldKarat} Ayar
          </span>
        </div>
        {product.hasWorkmanship === "true" && (
          <Badge variant="outline" className="bg-accent/20 text-accent-foreground mb-4" data-testid={`badge-workmanship-${product.id}`}>
            İşçilikli
          </Badge>
        )}
        <Button 
          onClick={handleWhatsAppOrder}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors font-medium"
          data-testid={`button-order-${product.id}`}
        >
          <i className="fab fa-whatsapp mr-2"></i>
          Sipariş Ver
        </Button>
      </div>
    </div>
  );
}
