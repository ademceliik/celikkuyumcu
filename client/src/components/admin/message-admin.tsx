import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MessageAdmin() {
  const { data: messages = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/messages"],
  });
  const queryClient = useQueryClient();
  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch((import.meta.env.VITE_API_URL || "") + `/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: "true" }),
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/messages"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch((import.meta.env.VITE_API_URL || "") + `/messages/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/messages"] }),
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" /> Mesajlar
          <Badge variant="secondary">{messages.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div className="text-muted-foreground">Henüz mesaj yok.</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 border rounded-lg bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-lg">{msg.name}</div>
                    {msg.isRead === "false" ? (
                      <Badge variant="destructive">Okunmadı</Badge>
                    ) : (
                      <Badge variant="secondary">Okundu</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">{msg.phone}</div>
                  <div className="mt-2 text-base">{msg.message}</div>
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[120px]">
                  <div className="text-xs text-gray-400">
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString("tr-TR") : ""}
                  </div>
                  <div className="flex gap-2">
                    {msg.isRead === "false" && (
                      <Button size="sm" variant="outline" onClick={() => markReadMutation.mutate(msg.id)} title="Okundu olarak işaretle">
                        <CheckCircle className="w-4 h-4 mr-1" /> Okundu
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(msg.id)} title="Sil">
                      <Trash2 className="w-4 h-4 mr-1" /> Sil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
