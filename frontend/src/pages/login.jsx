import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const envoyer = async (e) => {
    e.preventDefault();
    setErreur("");
    try {
      const { data } = await api.post(mode === "login" ? "/login" : "/register", form);
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;
      setErreur(errors ? Object.values(errors).flat().join(" ") : "Une erreur est survenue.");
    }
  };

  return (
    <div className="carte">
      <h1>Tadwiri</h1>
      <p className="sous">Recyclez, scannez, gagnez des points.</p>
      <form onSubmit={envoyer}>
        {mode === "register" && (
          <input name="name" placeholder="Nom" value={form.name} onChange={change} required />
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} required />
        <input name="password" type="password" placeholder="Mot de passe" value={form.password} onChange={change} required />
        {mode === "register" && (
          <input name="password_confirmation" type="password" placeholder="Confirmer le mot de passe"
                 value={form.password_confirmation} onChange={change} required />
        )}
        {erreur && <p className="erreur">{erreur}</p>}
        <button type="submit">{mode === "login" ? "Se connecter" : "Créer un compte"}</button>
      </form>
      <button className="lien" onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
      </button>
    </div>
  );
}