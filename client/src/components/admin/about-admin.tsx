import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import type { AboutInfo } from "@shared/schema";

const initialState = {
  title: "",
  description: "",
  experienceYears: "",
  customerCount: "",
  imageUrl: "",
};

export default function AboutAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<AboutInfo | null>({
    queryKey: ["/api/about-info"],
  });

  const [form, setForm] = React.useState(initialState);
  const [feedback, setFeedback] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (data) {
      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        experienceYears: data.experienceYears?.toString() ?? "",
        customerCount: data.customerCount?.toString() ?? "",
        imageUrl: data.imageUrl ?? "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (values: typeof form) => {
      const payload: Record<string, unknown> = {};
      if (values.title.trim()) payload.title = values.title.trim();
      if (values.description.trim()) payload.description = values.description.trim();
      if (values.imageUrl.trim()) payload.imageUrl = values.imageUrl.trim();
      if (values.experienceYears.trim()) payload.experienceYears = Number(values.experienceYears);
      if (values.customerCount.trim()) payload.customerCount = Number(values.customerCount);
      const res = await apiRequest("PUT", "/api/about-info", payload);
      return res.json();
    },
    onSuccess: () => {
      setFeedback("Kaydedildi");
      setError("");
      queryClient.invalidateQueries({ queryKey: ["/api/about-info"] });
    },
    onError: () => {
      setError("Kaydedilemedi");
      setFeedback("");
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback("");
    setError("");
    mutation.mutate(form);
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Hakkimizda Bilgileri</h2>
      {isLoading ? (
        <div>Yukleniyor...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" value={form.title} onChange={handleChange} placeholder="Baslik" />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Aciklama"
            className="w-full border rounded p-2"
          />
          <Input
            name="experienceYears"
            value={form.experienceYears}
            onChange={handleChange}
            placeholder="Deneyim Yili"
            type="number"
          />
          <Input
            name="customerCount"
            value={form.customerCount}
            onChange={handleChange}
            placeholder="Musteri Sayisi"
            type="number"
          />
          <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Gorsel URL" />
          <Button type="submit" disabled={mutation.isLoading}>
            Kaydet
          </Button>
          {feedback && <span className="text-green-600 ml-2">{feedback}</span>}
          {error && <span className="text-red-600 ml-2">{error}</span>}
        </form>
      )}
    </div>
  );
}
