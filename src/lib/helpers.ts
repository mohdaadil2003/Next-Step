export function getDaysLeft(deadline: string | Date | null | undefined): number {
  if (!deadline) return Infinity;
  const d = new Date(deadline);
  if (isNaN(d.getTime())) return Infinity;
  return Math.ceil((d.getTime() - new Date().getTime()) / 86400000);
}

export function parseSalary(str: string | null | undefined): number {
  if (!str) return 0;
  // Remove commas, extract all numbers, return the highest
  const cleaned = str.replace(/,/g, "");
  const matches = cleaned.match(/[\d.]+/g);
  if (!matches) return 0;
  return Math.max(...matches.map(Number));
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function stringToColor(str: string | null | undefined): string {
  const colors = [
    "#0A66C2", "#059669", "#D97706", "#DC2626", "#7C3AED",
    "#0891B2", "#BE185D", "#4F46E5", "#EA580C", "#0D9488",
  ];
  const s = str || "";
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = s.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function getDeadlineInfo(
  deadline: string | null | undefined
): { text: string; color: string } | null {
  if (!deadline) return null;
  const dl = new Date(deadline);
  if (isNaN(dl.getTime())) return null;
  const diff = Math.ceil((dl.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return { text: "Expired", color: "#DC2626" };
  if (diff <= 3) return { text: `${diff}d left`, color: "#DC2626" };
  if (diff <= 7) return { text: `${diff}d left`, color: "#D97706" };
  return { text: `${diff}d left`, color: "#059669" };
}
