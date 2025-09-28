import React, { useEffect, useState } from "react";

const ContactAdmin: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/contact-info")
      .then(res => res.json())
      .then(data => setPhone(data?.phone || ""))
      .catch(() => setError("Bilgi alınamadı"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    fetch("/api/contact-info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setSuccess(true);
      })
      .catch(() => setError("Kaydedilemedi"));
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">İletişim Bilgisi</h2>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <form onSubmit={handleSave} className="flex gap-2 items-center">
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="border px-3 py-2 rounded w-64"
            placeholder="Telefon Numarası"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">Kaydet</button>
          {success && <span className="text-green-600 ml-2">Kaydedildi</span>}
          {error && <span className="text-red-600 ml-2">{error}</span>}
        </form>
      )}
    </div>
  );
};

export default ContactAdmin;
