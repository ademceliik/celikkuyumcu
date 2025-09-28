import React, { useEffect, useState } from "react";

interface ExchangeRate {
  id: string;
  currency: string;
  rate: string;
}

const ExchangeAdmin: React.FC = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/exchange-rates")
      .then(res => res.json())
      .then(setRates)
      .catch(() => setError("Kur bilgileri alınamadı"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (idx: number, value: string) => {
    setRates(rates => rates.map((r, i) => i === idx ? { ...r, rate: value } : r));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    Promise.all(rates.map(rate =>
      fetch("/api/exchange-rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currency: rate.currency, rate: rate.rate })
      })
    ))
      .then(() => setSuccess(true))
      .catch(() => setError("Kaydedilemedi"));
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Kur Bilgisi</h2>
      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-2">
          {rates.map((rate, idx) => (
            <div key={rate.id} className="flex gap-2 items-center">
              <span className="w-32 font-semibold">{rate.currency}</span>
              <input
                type="text"
                value={rate.rate}
                onChange={e => handleChange(idx, e.target.value)}
                className="border px-3 py-2 rounded w-32"
                placeholder="Kur"
              />
            </div>
          ))}
          <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mt-2">Kaydet</button>
          {success && <span className="text-green-600 ml-2">Kaydedildi</span>}
          {error && <span className="text-red-600 ml-2">{error}</span>}
        </form>
      )}
    </div>
  );
};

export default ExchangeAdmin;
