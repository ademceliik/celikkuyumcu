import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomepageAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["/api/homepage-info"],
    queryFn: async () => {
      const res = await fetch("/api/homepage-info");
      return res.json();
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: any) => {
      const res = await fetch("/api/homepage-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/homepage-info"] }),
  });

  const [form, setForm] = React.useState({
    title: "",
    description: "",
    imageUrl: ""
  });

  React.useEffect(() => {
    if (data) setForm({
      title: data.title || "",
      description: data.description || "",
      imageUrl: data.imageUrl || ""
    });
  }, [data]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Anasayfa Bilgileri</h2>
      {isLoading ? <div>Yükleniyor...</div> : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="title" value={form.title} onChange={handleChange} placeholder="Başlık" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Açıklama" className="w-full border rounded p-2" />
          <Input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Görsel URL" />
          <Button type="submit" disabled={mutation.isLoading}>Kaydet</Button>
        </form>
      )}
    </div>
  );
}
