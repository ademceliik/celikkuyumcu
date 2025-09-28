import { Link, useLocation } from "wouter";
import MessageBadge from "@/components/admin/message-badge";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { WHATSAPP_PHONE } from "@/lib/constants";
import whatsappIcon from "@/assets/whatsapp.svg";

export default function Header() {
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${WHATSAPP_PHONE}?text=Merhaba, ürünleriniz hakkında bilgi almak istiyorum.`, '_blank');
  };

  const navItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/products", label: "Ürünler" },
    { href: "/about", label: "Hakkımızda" },
    { href: "/contact", label: "İletişim" },
    { href: "/admin-panel", label: (
      <span className="flex items-center">Mesajlar<MessageBadge /></span>
    ) },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center" data-testid="link-home">
            <i className="fas fa-gem text-primary text-2xl mr-3"></i>
            <h1 className="text-2xl font-serif font-bold text-foreground">Çelik Kuyumcu</h1>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors font-medium ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
                data-testid={`link-${typeof item.label === "string" ? item.label.toLowerCase().replace(' ', '-') : "mesajlar"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleWhatsAppClick}
              className="bg-green-500 text-white hover:bg-green-600 transition-colors flex items-center"
              data-testid="button-whatsapp"
            >
              <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5 mr-2" />
              WhatsApp
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-lg transition-colors ${
                        isActive(item.href)
                          ? "text-primary font-semibold"
                          : "text-foreground hover:text-primary"
                      }`}
                      data-testid={`mobile-link-${item.label.toLowerCase().replace(' ', '-')}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
