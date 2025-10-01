import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/product-card";
import { type Product } from "@shared/schema";
import { WHATSAPP_PHONE } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const FALLBACK_HOMEPAGE = {
  title: "Altinin Buyusunu Kesfedin",
  description: "Yillarin deneyimi ile en kaliteli altin takilari sunuyoruz.",
  imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&h=600",
};

export default function Home() {
  useDocumentTitle("Celik Kuyumcu");
  const { data: products = [], isLoading: isProductsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  const { data: homepageInfo, isLoading: isHomepageLoading } = useQuery<{ title?: string; description?: string; imageUrl?: string } | null>({
    queryKey: ["/api/homepage-info"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/homepage-info");
      return res.json();
    },
  });

  const heroTitle = homepageInfo?.title ?? FALLBACK_HOMEPAGE.title;
  const heroDescription = homepageInfo?.description ?? FALLBACK_HOMEPAGE.description;
  const heroImage = homepageInfo?.imageUrl ?? FALLBACK_HOMEPAGE.imageUrl;

  const featuredProducts = products.slice(0, 3);

  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=Merhaba, urunleriniz hakkinda bilgi almak istiyorum.`,
      "_blank",
    );
  };

  return (
    <>
      <section className="hero-gradient py-20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {isHomepageLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-14 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Skeleton className="h-12 w-40" />
                    <Skeleton className="h-12 w-40" />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-5xl font-serif font-bold text-foreground mb-6" data-testid="text-hero-title">
                    {heroTitle}
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-hero-description">
                    {heroDescription}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/products">
                      <Button
                        className="gold-gradient text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
                        data-testid="button-view-products"
                      >
                        Urunleri Incele
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button
                        variant="outline"
                        className="border border-border text-foreground px-8 py-4 rounded-lg font-semibold hover:bg-card transition-colors"
                        data-testid="button-contact"
                      >
                        Iletisime Gec
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              {isHomepageLoading ? (
                <Skeleton className="w-full h-[360px] rounded-xl" />
              ) : (
                <img
                  src={heroImage}
                  alt="Luks altin takim koleksiyonu"
                  className="rounded-xl shadow-2xl w-full h-auto"
                  data-testid="img-hero"
                />
              )}
              {!isHomepageLoading && (
                <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl shadow-lg" data-testid="card-experience">
                  <div className="text-2xl font-bold">25+</div>
                  <div className="text-sm">Yil Deneyim</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-serif font-bold text-foreground mb-4" data-testid="text-featured-title">
              One Cikan Urunler
            </h3>
            <p className="text-xl text-muted-foreground" data-testid="text-featured-subtitle">
              En populer ve ozel tasarim takilarimiz
            </p>
          </div>

          {isProductsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-background rounded-xl shadow-lg overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
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
              <Button
                className="gold-gradient text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
                data-testid="button-view-all-products"
              >
                Tum Urunleri Goruntule
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
