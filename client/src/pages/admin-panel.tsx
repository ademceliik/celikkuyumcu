import React, { useState } from "react";

import ProductAdmin from "../components/admin/product-admin";
import ContactAdmin from "../components/admin/contact-admin";
import ExchangeAdmin from "../components/admin/exchange-admin";
import MessageAdmin from "../components/admin/message-admin";
import HomepageAdmin from "../components/admin/homepage-admin";
import AboutAdmin from "../components/admin/about-admin";
import AdminLogin from "./admin-login";

const AdminPanel: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Çelik Kuyumcu Admin Paneli</h1>
  <HomepageAdmin />
  <AboutAdmin />
  <MessageAdmin />
  <ProductAdmin />
  <ContactAdmin />
  <ExchangeAdmin />
      </div>
    </div>
  );
};

export default AdminPanel;
