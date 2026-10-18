import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Scanner from "../components/Scanner";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [scans, setScans] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [message, setMessage] = useState(null);
  const [camera, setCamera] = useState(false);
  const navigate = useNavigate();

  const charger = async () => {
    try {
      const [me, liste] = await Promise.all([api.get("/me"), api.get("/scans")]);
      setUser(me.data);
      setScans(liste.data);
    } catch {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => { charger(); }, []);

  const valider = async (code) => {
    setMessage(null);
    try {
      const { data } = await api.post("/scans", { barcode: code });
      setMessage({ ok: true, texte: `+${data.points_gagnes} points !` });
      setBarcode("");
      charger();
    } catch (err) {
      setMessage({ ok: false, texte: err.response?.data?.message || "Erreur." });
    }
  };

  const envoyer = (e) => {
    e.preventDefault();
    valider(barcode);
  };

  const codeDetecte = (code) => {
    setCamera(false);
    valider(code);
  };

  const deconnexion = async () => {
    try { await api.post("/logout"); } catch {}
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p className="sous">Chargement...</p>;

  return (
    <div className="carte">
      <div className="entete">
        <h1>Bonjour {user.name}</h1>
        <button className="lien" onClick={deconnexion}>Déconnexion</button>
      </div>

      <div className="solde">
        <strong>{user.points}</strong> points
        <span>= {(user.points / 10).toFixed(1)} DH</span>
      </div>

      {camera ? (
        <Scanner onCode={codeDetecte} onClose={() => setCamera(false)} />
      ) : (
        <button onClick={() => setCamera(true)} style={{ width: "100%" }}>
          Scanner avec la caméra
        </button>
      )}

      <form onSubmit={envoyer}>
        <input placeholder="Ou saisir le code-barres" value={barcode}
               onChange={(e) => setBarcode(e.target.value)} required />
        <button type="submit">Valider le scan</button>
      </form>
      {message && <p className={message.ok ? "succes" : "erreur"}>{message.texte}</p>}

      <h2>Historique</h2>
      {scans.length === 0 ? (
        <p className="sous">Aucun scan pour le moment.</p>
      ) : (
        <ul className="historique">
          {scans.map((s) => (
            <li key={s.id}>
              <span>{s.product?.name}</span>
              <strong>+{s.points}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}