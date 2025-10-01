import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ExchangeRate } from "@shared/schema";

const ExchangeAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: rates = [], isLoading } = useQuery<ExchangeRate[]>({
    queryKey: ["/api/exchange-rates"],
  });

  const [localRates, setLocalRates] = React.useState<ExchangeRate[]>([]);
  const [feedback, setFeedback] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setLocalRates(rates);
  }, [rates]);

  const mutation = useMutation({
    mutationFn: async () => {
      await Promise.all(
        localRates.map((rate) =>
          apiRequest("PUT", "/api/exchange-rates", {
            currency: rate.currency,
            rate: rate.rate,
          }),
        ),
      );
    },
    onSuccess: () => {
      setFeedback("Kaydedildi");
      setError("");
      queryClient.invalidateQueries({ queryKey: ["/api/exchange-rates"] });
    },
    onError: () => {
      setError("Kaydedilemedi");
      setFeedback("");
    },
  });

  function handleChange(idx: number, value: string) {
    setLocalRates((prev) => prev.map((rate, i) => (i === idx ? { ...rate, rate: value } : rate)));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback("");
    setError("");
    mutation.mutate();
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Kur Bilgisi</h2>
      {isLoading ? (
        <div>Yukleniyor...</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          {localRates.map((rate, idx) => (
            <div key={rate.id} className="flex gap-2 items-center">
              <span className="w-32 font-semibold">{rate.currency}</span>
              <input
                type="text"
                value={rate.rate}
                onChange={(e) => handleChange(idx, e.target.value)}
                className="border px-3 py-2 rounded w-32"
                placeholder="Kur"
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition mt-2"
            disabled={mutation.isLoading}
          >
            Kaydet
          </button>
          {feedback && <span className="text-green-600 ml-2">{feedback}</span>}
          {error && <span className="text-red-600 ml-2">{error}</span>}
        </form>
      )}
    </div>
  );
};

export default ExchangeAdmin;
