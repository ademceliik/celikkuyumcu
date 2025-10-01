import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import type { ContactInfo } from "@shared/schema";

const initialState = {
  address: "",
  phone: "",
  workingHours: "",
};

const ContactAdmin: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<ContactInfo | null>({
    queryKey: ["/api/contact-info"],
  });

  const [form, setForm] = React.useState(initialState);
  const [feedback, setFeedback] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (data) {
      setForm({
        address: data.address ?? "",
        phone: data.phone ?? "",
        workingHours: data.workingHours ?? "",
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (values: typeof form) => {
      const payload: Record<string, unknown> = {};
      if (values.address.trim()) payload.address = values.address.trim();
      if (values.phone.trim()) payload.phone = values.phone.trim();
      if (values.workingHours.trim()) payload.workingHours = values.workingHours.trim();
      const res = await apiRequest("PUT", "/api/contact-info", payload);
      return res.json();
    },
    onSuccess: () => {
      setFeedback("Kaydedildi");
      setError("");
      queryClient.invalidateQueries({ queryKey: ["/api/contact-info"] });
    },
    onError: () => {
      setError("Kaydedilemedi");
      setFeedback("");
    },
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback("");
    setError("");
    updateMutation.mutate(form);
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Iletisim Bilgileri</h2>
      {isLoading ? (
        <div>Yukleniyor...</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
          <Input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Adres"
          />
          <Input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Telefon Numarasi"
          />
          <Input
            type="text"
            name="workingHours"
            value={form.workingHours}
            onChange={handleChange}
            placeholder="Calisma Saatleri"
          />
          <Button type="submit" disabled={updateMutation.isLoading}>
            Kaydet
          </Button>
          {feedback && <span className="text-green-600 ml-2">{feedback}</span>}
          {error && <span className="text-red-600 ml-2">{error}</span>}
        </form>
      )}
    </div>
  );
};

export default ContactAdmin;
