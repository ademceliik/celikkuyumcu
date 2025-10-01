import React, { useState } from "react";
import { apiRequest } from "@/lib/queryClient";

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await apiRequest("POST", "/api/admin/login", { username, password });
      onLogin();
    } catch (err) {
      if (err instanceof Error && (err.message.startsWith("400") || err.message.startsWith("401"))) {
        setError("Kullanici adi veya sifre hatali");
      } else {
        setError("Sunucuya baglanilamadi");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Admin Girişi</h2>
        <input
          type="text"
          placeholder="Kullanici Adi"
          className="border rounded px-3 py-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Sifre"
          className="border rounded px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
