import React, { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }
      console.log("Inicio de sesión exitoso:", data);
      alert("Inicio de sesión exitoso , check the token");
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-slate-800 p-8 rounded-lg shadow-lg"
    >
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-bold mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-bold mb-2">
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 bg-slate-700 border-slate-600 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Entrar
        </button>
      </div>
    </form>
  );
}
