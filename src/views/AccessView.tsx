import { ExternalLink } from "lucide-react";

const LINKS = [
  {
    name: "Bsport",
    href: "https://backoffice.bsport.io",
    desc: "Gestion des cours et réservations",
  },
  {
    name: "MMA platform",
    href: "https://core-society-mma.vercel.app",
    desc: "Agents marketing IA",
  },
  {
    name: "Dashboard finances",
    href: "https://compta.coresociety.fr",
    desc: "Trésorerie et transactions BRED",
  },
  {
    name: "Instagram",
    href: "https://instagram.com/coresociety_fr",
    desc: "@coresociety_fr · Contenu & stats",
  },
  {
    name: "coresociety.fr",
    href: "https://coresociety.fr",
    desc: "Site principal du studio",
  },
  {
    name: "Google Business",
    href: "https://business.google.com",
    desc: "Avis et fiche établissement",
  },
  {
    name: "Swello",
    href: "https://swello.com",
    desc: "Programmation des publications",
  },
];

export function AccessView() {
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px",
          maxWidth: "900px",
        }}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-all duration-150 hover:-translate-y-[2px] hover:border-blue hover:shadow-[0_6px_16px_rgba(28,66,189,0.12)]"
            style={{
              background: "#ffffff",
              border: "1px solid #e4e4e0",
              borderRadius: "10px",
              padding: "18px 20px",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {/* Header : nom + icône à droite */}
            <div className="flex items-start justify-between">
              <span className="text-[14px] font-[700] text-ink">
                {link.name}
              </span>
              <span className="text-blue">
                <ExternalLink size={16} strokeWidth={2} />
              </span>
            </div>
            <span className="text-[10px] font-[400] text-[#bbb]">
              {link.href.replace(/^https?:\/\//, "")}
            </span>
            <span
              className="text-[10px] font-[400] text-[#888]"
              style={{ lineHeight: 1.5, marginTop: "2px" }}
            >
              {link.desc}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
