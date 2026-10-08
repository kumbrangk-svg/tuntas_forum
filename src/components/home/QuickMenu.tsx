import Link from "next/link";

const CARDS = [
  {
    title: "Catatan",
    desc: "Lihat dan bagikan catatan tugas & masalah.",
    icon: "📄",
    href: "/cari?jenis=tugas",
    bg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    title: "Forum",
    desc: "Ajukan pertanyaan, dapatkan jawaban.",
    icon: "💬",
    href: "/forum",
    bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    title: "Regulasi",
    desc: "Akses peraturan dan ketentuan terkait.",
    icon: "⚖️",
    href: "/regulasi",
    bg: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    title: "Tag",
    desc: "Jelajahi topik sesuai minat Anda.",
    icon: "🏷️",
    href: "/tag",
    bg: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export function QuickMenu() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CARDS.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 shadow-2xs hover:shadow-sm transition flex flex-col justify-between"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg border ${card.bg}`}>
              {card.icon}
            </div>
            <h3 className="font-bold text-slate-800 text-sm">{card.title}</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">{card.desc}</p>
        </Link>
      ))}
    </div>
  );
}
