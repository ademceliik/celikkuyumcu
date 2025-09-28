import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WHATSAPP_PHONE } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function Contact() {
  useDocumentTitle("Çelik Kuyumcu | İletişim");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: ""
  });
  const { data: contactInfo } = useQuery({
    queryKey: ["/api/contact-info"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/contact-info`);
      return res.json();
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurun.",
        variant: "destructive",
      });
      return;
    }
    // ...existing code...
  };

  // WhatsApp butonu fonksiyonu eksikse ekle
  const handleWhatsAppClick = () => {
    if (contactInfo?.phone) {
      window.open(`https://wa.me/${contactInfo.phone.replace(/\D/g, "")}?text=Merhaba, ürünleriniz hakkında bilgi almak istiyorum.`, '_blank');
    }
  };

  return (
    <section className="py-20 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-bold text-foreground">İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="font-semibold">Telefon:</div>
                  <div className="text-muted-foreground">{contactInfo?.phone || "-"}</div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold">Adres:</div>
                  <div className="text-muted-foreground">{contactInfo?.address || "-"}</div>
                </div>
                <div className="mb-4">
                  <div className="font-semibold">Çalışma Saatleri:</div>
                  <div className="text-muted-foreground">{contactInfo?.workingHours || "-"}</div>
                </div>
                <Button onClick={handleWhatsAppClick} className="bg-green-500 text-white hover:bg-green-600 mt-2">
                  WhatsApp'tan Yaz
                </Button>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-bold text-foreground">Bize Mesaj Gönderin</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="message">Mesajınız</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required />
                  </div>
                  <Button type="submit" className="w-full">Gönder</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
