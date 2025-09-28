import React, { useEffect, useState } from "react";


const ContactAdmin: React.FC = () => {
  const [form, setForm] = useState({
    address: "",
    phone: "",
    workingHours: ""
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/contact-info")
      .then(res => res.json())
      .then(data => setForm({
        address: data?.address || "",
        phone: data?.phone || "",
        workingHours: data?.workingHours || ""
      }))
      .catch(() => setError("Bilgi alınamadı"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    fetch("/api/contact-info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => {
        if (!res.ok) throw new Error();
        setSuccess(true);
      })
      .catch(() => setError("Kaydedilemedi"));
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">İletişim Bilgileri</h2>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-3 max-w-md">
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            placeholder="Adres"
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            placeholder="Telefon Numarası"
          />
          <input
            type="text"
            name="workingHours"
            value={form.workingHours}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            placeholder="Çalışma Saatleri"
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
