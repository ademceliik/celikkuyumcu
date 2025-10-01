import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { AboutInfo } from "@shared/schema";

const FALLBACK_ABOUT = {
  title: "Hakkimizda",
  description: "Celik Kuyumcu yillarin verdigi deneyimle musterilerine ozel tasarimlar sunar.",
  experienceYears: 25,
  customerCount: 1000,
};

export default function About() {
  useDocumentTitle("Çelik Kuyumcu | Hakkımızda");
  const { data: aboutInfo, isLoading } = useQuery<AboutInfo | null>({
    queryKey: ["/api/about-info"],
  });

  const title = aboutInfo?.title ?? FALLBACK_ABOUT.title;
  const description = aboutInfo?.description ?? FALLBACK_ABOUT.description;
  const experienceYears = aboutInfo?.experienceYears ?? FALLBACK_ABOUT.experienceYears;
  const customerCount = aboutInfo?.customerCount ?? FALLBACK_ABOUT.customerCount;
  const imageUrl = aboutInfo?.imageUrl ?? "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&h=600";

  return (
    <section className="py-20 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <div className="grid grid-cols-2 gap-6">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-4xl font-serif font-bold text-foreground mb-6" data-testid="text-about-title">
                  {title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed whitespace-pre-line" data-testid="text-about-description-1">
                  {description}
                </p>
                <div className="grid grid-cols-2 gap-6" data-testid="stats-container">
                  <div className="text-center p-4 bg-background rounded-lg" data-testid="stat-experience">
                    <div className="text-2xl font-bold text-primary mb-2">{experienceYears}+</div>
                    <div className="text-muted-foreground">Yıl Deneyim</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg" data-testid="stat-customers">
                    <div className="text-2xl font-bold text-primary mb-2">{customerCount}+</div>
                    <div className="text-muted-foreground">Mutlu Müşteri</div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            {isLoading ? (
              <Skeleton className="w-full h-[360px] rounded-xl" />
            ) : (
              <img
                src={imageUrl}
                alt="Kuyumcu atolyesi"
                className="rounded-xl shadow-2xl w-full h-auto"
                data-testid="img-workshop"
              />
            )}
          </div>
        </div>

        <div className="mt-20">
          <h4 className="text-3xl font-serif font-bold text-center text-foreground mb-12" data-testid="text-values-title">
            Değerlerimiz
          </h4>
          <div className="grid md:grid-cols-3 gap-8" data-testid="values-grid">
            <div className="text-center p-6 bg-background rounded-xl shadow-lg" data-testid="value-quality">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-award text-primary text-2xl"></i>
              </div>
              <h5 className="text-xl font-semibold text-foreground mb-3">Kalite</h5>
              <p className="text-muted-foreground">En yüksek kalitede altın ve madenleri sunuyoruz.</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl shadow-lg" data-testid="value-trust">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-primary text-2xl"></i>
              </div>
              <h5 className="text-xl font-semibold text-foreground mb-3">Güven</h5>
              <p className="text-muted-foreground">Deneyimimizle müşterilerimizin güvenini kazandık.</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl shadow-lg" data-testid="value-service">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-primary text-2xl"></i>
              </div>
              <h5 className="text-xl font-semibold text-foreground mb-3">Hizmet</h5>
              <p className="text-muted-foreground">Müşteri memnuniyeti odaklı hizmet anlayışına sahibiz.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
