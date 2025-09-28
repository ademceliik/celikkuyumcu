import React, { useState } from "react";

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        onLogin();
      } else {
        setError("Kullanıcı adı veya şifre hatalı");
      }
    } catch {
      setError("Sunucuya bağlanılamadı");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Admin Girişi</h2>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          className="border rounded px-3 py-2"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Şifre"
          className="border rounded px-3 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Giriş Yap</button>
      </form>
    </div>
  );
};

export default AdminLogin;
