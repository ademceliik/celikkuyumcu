import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AboutAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["/api/about-info"], async () => {
    const res = await fetch("/api/about-info");
    return res.json();
  });
  const mutation = useMutation(
    async (values: any) => {
      const res = await fetch("/api/about-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      return res.json();
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["/api/about-info"]),
    }
  );

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    experienceYears: "",
    customerCount: "",
    imageUrl: ""
  });

  React.useEffect(() => {
    if (data) setForm({
      title: data.title || "",
      description: data.description || "",
      experienceYears: data.experienceYears?.toString() || "",
      customerCount: data.customerCount?.toString() || "",
      imageUrl: data.imageUrl || ""
    });
  }, [data]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({
      ...form,
      experienceYears: Number(form.experienceYears),
      customerCount: Number(form.customerCount)
    });
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Hakkımızda Bilgileri</h2>
      {isLoading ? <div>Yükleniyor...</div> : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" value={form.title} onChange={handleChange} placeholder="Başlık" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Açıklama" className="w-full border rounded p-2" />
          <Input name="experienceYears" value={form.experienceYears} onChange={handleChange} placeholder="Deneyim Yılı" type="number" />
          <Input name="customerCount" value={form.customerCount} onChange={handleChange} placeholder="Müşteri Sayısı" type="number" />
          <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Görsel URL" />
          <Button type="submit" disabled={mutation.isLoading}>Kaydet</Button>
        </form>
      )}
    </div>
  );
}
