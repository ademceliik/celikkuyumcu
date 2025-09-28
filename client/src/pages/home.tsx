import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import { type Product } from "@shared/schema";
import { WHATSAPP_PHONE } from "@/lib/constants";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Home() {
  useDocumentTitle("Çelik Kuyumcu");
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  const { data: homepageInfo } = useQuery({
    queryKey: ["/api/homepage-info"],
    queryFn: async () => {
      const res = await fetch("/api/homepage-info");
      return res.json();
    },
  });

  const featuredProducts = products.slice(0, 3);

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=Merhaba, ürünleriniz hakkında bilgi almak istiyorum.`, '_blank');
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-gradient py-20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-serif font-bold text-foreground mb-6" data-testid="text-hero-title">
                {homepageInfo?.title || "Altının Büyüsünü Keşfedin"}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-hero-description">
                {homepageInfo?.description || "Yılların deneyimi ile sizlere en kaliteli altın takıları sunuyoruz. Her ürünümüz titizlikle seçilmiş ve ustaca işlenmiştir."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button className="gold-gradient text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all" data-testid="button-view-products">
                    Ürünleri İncele
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" className="border border-border text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-card transition-colors" data-testid="button-contact">
                    İletişime Geç
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={homepageInfo?.imageUrl || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} 
                alt="Lüks altın takı koleksiyonu" 
                className="rounded-xl shadow-2xl w-full h-auto"
                data-testid="img-hero"
              />
              {/* Deneyim kartı sabit bırakıldı, AboutInfo ile birleştirilebilir */}
              <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg" data-testid="card-experience">
                <div className="text-2xl font-bold">25+</div>
                <div className="text-sm">Yıl Deneyim</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-featured-title">
              Öne Çıkan Ürünler
            </h3>
            <p className="text-xl text-muted-foreground" data-testid="text-featured-subtitle">
              En popüler ve özel tasarım takılarımız
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-background rounded-xl shadow-lg overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-featured-products">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="gold-gradient text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all" data-testid="button-view-all-products">
                Tüm Ürünleri Görüntüle
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
