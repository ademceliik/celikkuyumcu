import { Link } from "wouter";
import { CONTACT_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <i className="fas fa-gem text-primary text-xl mr-2"></i>
              <h4 className="text-xl font-serif font-bold">Çelik Kuyumcu</h4>
            </div>
            <p className="text-secondary-foreground/70 mb-4">
              25 yılın deneyimi ile kaliteli altın takılar üretiyoruz.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground" data-testid="link-facebook">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground" data-testid="link-instagram">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-secondary-foreground/70 hover:text-secondary-foreground" data-testid="link-whatsapp-footer">
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Hızlı Linkler</h5>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li><Link href="/" className="hover:text-secondary-foreground" data-testid="footer-link-home">Ana Sayfa</Link></li>
              <li><Link href="/products" className="hover:text-secondary-foreground" data-testid="footer-link-products">Ürünler</Link></li>
              <li><Link href="/about" className="hover:text-secondary-foreground" data-testid="footer-link-about">Hakkımızda</Link></li>
              <li><Link href="/contact" className="hover:text-secondary-foreground" data-testid="footer-link-contact">İletişim</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">Kategoriler</h5>
            <ul className="space-y-2 text-secondary-foreground/70">
              <li><Link href="/products?category=yuzuk" className="hover:text-secondary-foreground" data-testid="footer-link-rings">Yüzükler</Link></li>
              <li><Link href="/products?category=kolye" className="hover:text-secondary-foreground" data-testid="footer-link-necklaces">Kolyeler</Link></li>
              <li><Link href="/products?category=kupe" className="hover:text-secondary-foreground" data-testid="footer-link-earrings">Küpeler</Link></li>
              <li><Link href="/products?category=bilezik" className="hover:text-secondary-foreground" data-testid="footer-link-bracelets">Bilezikler</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold mb-4">İletişim Bilgileri</h5>
            <div className="space-y-2 text-secondary-foreground/70">
              <p data-testid="text-address">
                <i className="fas fa-map-marker-alt mr-2"></i>
                {CONTACT_INFO.address.split('\n')[0]}
              </p>
              <p data-testid="text-phone">
                <i className="fas fa-phone mr-2"></i>
                {CONTACT_INFO.phone}
              </p>
              <p data-testid="text-email">
                <i className="fas fa-envelope mr-2"></i>
                {CONTACT_INFO.email}
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-secondary-foreground/70">
          <p>&copy; 2024 Çelik Kuyumcu. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
