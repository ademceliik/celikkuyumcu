import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertProductSchema, type Product } from "@shared/schema";
import { JEWELRY_CATEGORIES, GOLD_KARATS } from "@/lib/constants";
import { z } from "zod";

const formSchema = insertProductSchema.extend({
  weight: z.string().min(1, "Gram alanı zorunludur").regex(/^\d+(\.\d{1,2})?$/, "Geçerli bir gram değeri girin"),
  goldKarat: z.number().min(1, "Ayar seçimi zorunludur"),
  imageUrl: z.string().url("Geçerli bir URL girin"),
});

type FormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      weight: product?.weight || "",
      goldKarat: product?.goldKarat || 18,
      imageUrl: product?.imageUrl || "",
      isActive: product?.isActive || "true",
      hasWorkmanship: product?.hasWorkmanship || "true",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla oluşturuldu.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ürün oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!product) throw new Error("Product not found");
      const response = await apiRequest("PATCH", `/api/products/${product.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Başarılı",
        description: "Ürün başarıyla güncellendi.",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Ürün güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (product) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-product">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ürün Adı</FormLabel>
              <FormControl>
                <Input placeholder="Ürün adını girin" {...field} data-testid="input-product-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-product-category">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(JEWELRY_CATEGORIES).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gram</FormLabel>
                <FormControl>
                  <Input placeholder="0.00" {...field} data-testid="input-product-weight" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="goldKarat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Altın Ayarı</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger data-testid="select-product-karat">
                      <SelectValue placeholder="Ayar seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GOLD_KARATS.map((karat) => (
                      <SelectItem key={karat} value={karat.toString()}>{karat} Ayar</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resim URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-product-image" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Aktif</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Ürün sitede görünür olsun mu?
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "true"}
                    onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                    data-testid="switch-product-active"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hasWorkmanship"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">İşçilikli</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Ürün işçilik içeriyor mu?
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === "true"}
                    onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                    data-testid="switch-product-workmanship"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
            İptal
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="gold-gradient text-primary-foreground"
            data-testid="button-save-product"
          >
            {isLoading ? "Kaydediliyor..." : (product ? "Güncelle" : "Oluştur")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
