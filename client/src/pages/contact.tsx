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
  const { data: contactInfo } = useQuery(["/api/contact-info"], async () => {
    const res = await fetch("/api/contact-info");
    return res.json();
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
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4" data-testid="contact-address">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <i className="fas fa-map-marker-alt text-primary text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Adres</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="contact-phone">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <i className="fas fa-phone text-primary text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Telefon</h4>
                  <p className="text-muted-foreground">{CONTACT_INFO.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="contact-hours">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <i className="fas fa-clock text-primary text-xl"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Çalışma Saatleri</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {CONTACT_INFO.workingHours}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 space-y-4">
              <Button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 text-white hover:bg-green-600 transition-colors font-medium flex items-center justify-center py-4"
                data-testid="button-whatsapp-contact"
              >
                <i className="fab fa-whatsapp mr-3 text-xl"></i>
                WhatsApp ile İletişim
              </Button>
              <Button
                onClick={handlePhoneClick}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors font-medium flex items-center justify-center py-4"
                data-testid="button-phone-contact"
              >
                <i className="fas fa-phone mr-3"></i>
                Hemen Ara
              </Button>
            </div>
          </div>
          
          <Card className="shadow-lg" data-testid="card-contact-form">
            <CardHeader>
              <CardTitle className="text-2xl font-serif font-bold text-foreground">
                Mesaj Gönderin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Ad Soyad
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Adınızı ve soyadınızı girin"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Telefon
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Telefon numaranızı girin"
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Mesaj
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Mesajınızı yazın..."
                    data-testid="textarea-message"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full gold-gradient text-primary-foreground py-3 font-semibold hover:shadow-lg transition-all"
                  data-testid="button-send-message"
                >
                  Mesajı Gönder
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
