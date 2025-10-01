import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export default function About() {
  useDocumentTitle("Çelik Kuyumcu | Hakkımızda");
  const { data: aboutInfo } = useQuery({
    queryKey: ["/api/about-info"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/about-info");
      return res.json();
    },
  });
  return (
    <section className="py-20 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-serif font-bold text-foreground mb-6" data-testid="text-about-title">
              {aboutInfo?.title || "Hakkımızda"}
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed" data-testid="text-about-description-1">
              {aboutInfo?.description || "1998 yılından bu yana altın ve mücevherat sektöründe hizmet veren Çelik Kuyumcu, müşterilerine en kaliteli ürünleri sunma konusunda kararlılığını sürdürmektedir."}
            </p>
            <div className="grid grid-cols-2 gap-6" data-testid="stats-container">
              <div className="text-center p-4 bg-background rounded-lg" data-testid="stat-experience">
                <div className="text-2xl font-bold text-primary mb-2">{aboutInfo?.experienceYears ?? 25}+</div>
                <div className="text-muted-foreground">Yıl Deneyim</div>
              </div>
              <div className="text-center p-4 bg-background rounded-lg" data-testid="stat-customers">
                <div className="text-2xl font-bold text-primary mb-2">{aboutInfo?.customerCount ?? 1000}+</div>
                <div className="text-muted-foreground">Mutlu Müşteri</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src={aboutInfo?.imageUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"} 
              alt="Kuyumcu atölyesi" 
              className="rounded-xl shadow-2xl w-full h-auto"
              data-testid="img-workshop"
            />
          </div>
        </div>

        {/* Company Values Section */}
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
              <p className="text-muted-foreground">
                En yüksek kalitede altın ve mücevherat ürünleri sunuyoruz.
              </p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl shadow-lg" data-testid="value-trust">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-handshake text-primary text-2xl"></i>
              </div>
              <h5 className="text-xl font-semibold text-foreground mb-3">Güven</h5>
              <p className="text-muted-foreground">
                25 yıllık deneyimimizle müşterilerimizin güvenini kazandık.
              </p>
            </div>
            
            <div className="text-center p-6 bg-background rounded-xl shadow-lg" data-testid="value-service">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-heart text-primary text-2xl"></i>
              </div>
              <h5 className="text-xl font-semibold text-foreground mb-3">Hizmet</h5>
              <p className="text-muted-foreground">
                Müşteri memnuniyeti odaklı hizmet anlayışımızla çalışıyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
