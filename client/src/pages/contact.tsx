import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WHATSAPP_PHONE } from "@/lib/constants";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { ContactInfo } from "@shared/schema";

export default function Contact() {
  useDocumentTitle("Celik Kuyumcu | Iletisim");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: contactInfo,
    isLoading: isContactInfoLoading,
  } = useQuery<ContactInfo | null>({
    queryKey: ["/api/contact-info"],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Hata",
        description: "Lutfen tum alanlari doldurun.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/messages", {
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      toast({
        title: "Tesekkurler",
        description: "Mesajiniz basariyla gonderildi.",
      });
      setFormData({ name: "", phone: "", message: "" });
    } catch (err) {
      toast({
        title: "Hata",
        description: "Mesaj gonderilirken bir sorun olustu. Lutfen tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    const phone = contactInfo?.phone || WHATSAPP_PHONE;
    if (phone) {
      window.open(
        `https://wa.me/${phone.replace(/\D/g, "")}?text=Merhaba, urunleriniz hakkinda bilgi almak istiyorum.`,
        "_blank",
      );
    }
  };

  return (
    <section className="py-20 bg-muted min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-bold text-foreground">Iletisim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                {isContactInfoLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-10 w-40" />
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <div className="font-semibold">Telefon:</div>
                      <div className="text-muted-foreground">{contactInfo?.phone || "-"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="font-semibold">Adres:</div>
                      <div className="text-muted-foreground">{contactInfo?.address || "-"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="font-semibold">Calisma Saatleri:</div>
                      <div className="text-muted-foreground">{contactInfo?.workingHours || "-"}</div>
                    </div>
                    <Button onClick={handleWhatsAppClick} className="bg-green-500 text-white hover:bg-green-600 mt-2">
                      WhatsApp'tan Yaz
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-serif font-bold text-foreground">Bize Mesaj Gonderin</CardTitle>
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
                    <Label htmlFor="message">Mesajiniz</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Gonderiliyor..." : "Gonder"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
