import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function Scanner({ onCode, onClose }) {
  const termine = useRef(false);

  useEffect(() => {
    const lecteur = new Html5Qrcode("lecteur");

    lecteur
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (texte) => {
          if (termine.current) return;
          termine.current = true;
          onCode(texte);
        },
        () => {}
      )
      .catch(() => {});

    return () => {
      lecteur.stop().then(() => lecteur.clear()).catch(() => {});
    };
  }, []);

  return (
    <div>
      <div id="lecteur" style={{ width: "100%", marginTop: 12 }}></div>
      <button className="lien" onClick={onClose}>Fermer la caméra</button>
    </div>
  );
}