import { useQuery } from "@tanstack/react-query";

export default function MessageBadge() {
  const { data: messages = [] } = useQuery<any[]>({ queryKey: ["/api/messages"] });
  const unreadCount = messages.filter((m) => m.isRead === "false").length;
  if (unreadCount === 0) return null;
  return (
    <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full animate-pulse">
      {unreadCount}
    </span>
  );
}
