import type { Eyes } from "../pet/Pet";

const rr = (x: number, y: number, w: number, h: number, r: number) => {
  const k = Math.min(r, w / 2, h / 2);
  return `M${x + k} ${y}H${x + w - k}A${k} ${k} 0 0 1 ${x + w} ${y + k}V${y + h - k}A${k} ${k} 0 0 1 ${x + w - k} ${y + h}H${x + k}A${k} ${k} 0 0 1 ${x} ${y + h - k}V${y + k}A${k} ${k} 0 0 1 ${x + k} ${y}Z`;
};

const circle = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;

const ring = (cx: number, cy: number, r: number, inner: number) => `${circle(cx, cy, r)}${circle(cx, cy, inner)}`;

function star(cx: number, cy: number, outer: number, inner: number, points = 5) {
  let d = "";
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? inner : outer;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  }
  return `${d}Z`;
}

function rays(cx: number, cy: number, r: number, size: number, count: number) {
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    d += circle(cx + r * Math.cos(a), cy + r * Math.sin(a), size);
  }
  return d;
}

export type MascotObject = {
  id: string;
  name: { en: string; pt: string };
  d: string;
  eyes: Eyes;
  color: string;
  words: string[];
};

export const objects: MascotObject[] = [
  {
    id: "mug",
    name: { en: "Mug", pt: "Caneca" },
    d: rr(24, 38, 52, 60, 12) + ring(90, 66, 13, 6),
    eyes: { x: 50, y: 64, gap: 11, size: 0.9 },
    color: "#14b8a6",
    words: ["coffee", "cafe", "café", "cafeteria", "tea", "chá", "bakery breakfast", "mug", "caneca", "barista"],
  },
  {
    id: "dumbbell",
    name: { en: "Dumbbell", pt: "Haltere" },
    d: rr(10, 34, 22, 52, 7) + rr(32, 46, 56, 28, 9) + rr(88, 34, 22, 52, 7),
    eyes: { x: 60, y: 60, gap: 10, size: 0.8 },
    color: "#8b5cf6",
    words: ["gym", "academia", "fitness", "workout", "treino", "crossfit", "personal trainer", "musculação", "sport", "esporte"],
  },
  {
    id: "controller",
    name: { en: "Controller", pt: "Controle" },
    d: "M32 36H88C104 36 112 50 110 66L106 88C104 100 90 102 84 92L78 82H42L36 92C30 102 16 100 14 88L10 66C8 50 16 36 32 36Z",
    eyes: { x: 60, y: 58, gap: 12, size: 0.95 },
    color: "#f43f5e",
    words: ["game", "games", "gaming", "jogo", "jogos", "studio", "estúdio", "esports", "console", "arcade"],
  },
  {
    id: "plant",
    name: { en: "Plant", pt: "Planta" },
    d: "M32 62H88L80 104H40Z" + "M58 60C40 58 30 44 34 28C50 30 58 42 58 60Z" + "M62 60C62 42 72 28 90 26C92 44 80 58 62 60Z",
    eyes: { x: 60, y: 80, gap: 10, size: 0.85 },
    color: "#22c55e",
    words: ["plant", "plants", "planta", "plantas", "garden", "jardim", "flower shop", "floricultura", "nature", "natureza", "eco", "green"],
  },
  {
    id: "book",
    name: { en: "Book", pt: "Livro" },
    d: rr(28, 22, 64, 76, 9) + rr(74, 98, 10, 12, 2),
    eyes: { x: 60, y: 58, gap: 12, size: 1 },
    color: "#f59e0b",
    words: ["book", "books", "livro", "livros", "bookstore", "livraria", "school", "escola", "course", "curso", "library", "biblioteca", "education", "educação", "study"],
  },
  {
    id: "camera",
    name: { en: "Camera", pt: "Câmera" },
    d: rr(42, 30, 30, 12, 4) + rr(16, 42, 88, 56, 14),
    eyes: { x: 60, y: 70, gap: 13, size: 1 },
    color: "#0ea5e9",
    words: ["photo", "photography", "foto", "fotografia", "camera", "câmera", "film", "video", "vídeo", "studio photo", "wedding", "casamento"],
  },
  {
    id: "bag",
    name: { en: "Bag", pt: "Sacola" },
    d: "M42 44V38C42 24 78 24 78 38V44H71V38C71 31 49 31 49 38V44Z" + rr(24, 44, 72, 58, 10),
    eyes: { x: 60, y: 72, gap: 13, size: 1 },
    color: "#ec4899",
    words: ["shop", "store", "loja", "ecommerce", "e-commerce", "fashion", "moda", "boutique", "clothes", "roupa", "market", "mercado", "retail", "varejo"],
  },
  {
    id: "house",
    name: { en: "House", pt: "Casa" },
    d: "M60 18L102 54V98C102 101 100 103 97 103H23C20 103 18 101 18 98V54Z",
    eyes: { x: 60, y: 70, gap: 13, size: 1 },
    color: "#6366f1",
    words: ["home", "house", "casa", "real estate", "imobiliária", "rent", "aluguel", "architecture", "arquitetura", "interior", "construction", "construção"],
  },
  {
    id: "tooth",
    name: { en: "Tooth", pt: "Dente" },
    d: "M30 34C30 22 46 20 60 26C74 20 90 22 90 34C90 52 84 62 82 82C80 98 70 100 68 88L64 72H56L52 88C50 100 40 98 38 82C36 62 30 52 30 34Z",
    eyes: { x: 60, y: 46, gap: 12, size: 0.95 },
    color: "#38bdf8",
    words: ["dentist", "dentista", "dental", "odonto", "odontologia", "tooth", "dente", "clinic", "clínica", "smile", "sorriso"],
  },
  {
    id: "paw",
    name: { en: "Paw", pt: "Pata" },
    d: "M60 54C82 54 94 72 92 86C90 100 76 100 60 96C44 100 30 100 28 86C26 72 38 54 60 54Z" + circle(32, 42, 9) + circle(50, 28, 9) + circle(70, 28, 9) + circle(88, 42, 9),
    eyes: { x: 60, y: 78, gap: 11, size: 0.9 },
    color: "#f97316",
    words: ["pet", "pets", "petshop", "pet shop", "dog", "cachorro", "cat", "gato", "vet", "veterinário", "veterinária", "animal", "animals"],
  },
  {
    id: "note",
    name: { en: "Note", pt: "Nota" },
    d: "M66 18H74L96 28V44L74 36V84C74 96 62 104 48 102C34 100 28 90 34 82C40 74 54 72 66 76Z",
    eyes: { x: 50, y: 88, gap: 8, size: 0.7 },
    color: "#a855f7",
    words: ["music", "música", "band", "banda", "song", "podcast", "audio", "áudio", "dj", "concert", "show", "instrument", "instrumento"],
  },
  {
    id: "rocket",
    name: { en: "Rocket", pt: "Foguete" },
    d: "M60 12C78 26 82 50 80 76H40C38 50 42 26 60 12Z" + "M40 60L24 82V96L40 86Z" + "M80 60L96 82V96L80 86Z" + "M48 80H72L66 100H54Z",
    eyes: { x: 60, y: 48, gap: 9, size: 0.8 },
    color: "#ef4444",
    words: ["startup", "launch", "lançamento", "tech", "tecnologia", "saas", "software", "app", "aplicativo", "space", "espaço", "growth", "crescimento"],
  },
  {
    id: "cloud",
    name: { en: "Cloud", pt: "Nuvem" },
    d: "M30 90C14 90 10 70 25 65C22 48 42 40 54 48C60 32 88 34 90 54C106 54 110 78 98 87C96 89 93 90 90 90Z",
    eyes: { x: 60, y: 70, gap: 13, size: 1 },
    color: "#60a5fa",
    words: ["cloud", "nuvem", "hosting", "hospedagem", "server", "servidor", "data", "dados", "weather", "clima", "storage", "backup", "devops"],
  },
  {
    id: "heart",
    name: { en: "Heart", pt: "Coração" },
    d: "M60 100C40 86 16 70 16 46C16 30 30 22 42 24C50 25 56 30 60 36C64 30 70 25 78 24C90 22 104 30 104 46C104 70 80 86 60 100Z",
    eyes: { x: 60, y: 56, gap: 13, size: 1 },
    color: "#f43f5e",
    words: ["love", "amor", "dating", "relacionamento", "health", "saúde", "care", "cuidado", "charity", "ong", "donation", "doação", "wedding", "casamento", "cardio"],
  },
  {
    id: "star",
    name: { en: "Star", pt: "Estrela" },
    d: star(60, 62, 48, 22),
    eyes: { x: 60, y: 64, gap: 9, size: 0.8 },
    color: "#eab308",
    words: ["star", "estrela", "review", "avaliação", "rating", "awards", "prêmio", "events", "eventos", "kids", "crianças", "party", "festa", "fan"],
  },
  {
    id: "drop",
    name: { en: "Drop", pt: "Gota" },
    d: "M60 14C76 38 92 56 92 76C92 94 78 106 60 106C42 106 28 94 28 76C28 56 44 38 60 14Z",
    eyes: { x: 60, y: 78, gap: 12, size: 0.95 },
    color: "#06b6d4",
    words: ["water", "água", "cleaning", "limpeza", "laundry", "lavanderia", "spa", "plumber", "encanador", "pool", "piscina", "beauty", "skincare", "oil"],
  },
  {
    id: "chat",
    name: { en: "Chat", pt: "Balão" },
    d: rr(18, 24, 84, 60, 18) + "M34 84L28 102L52 84Z",
    eyes: { x: 60, y: 54, gap: 13, size: 1 },
    color: "#3b82f6",
    words: ["chat", "support", "suporte", "help", "ajuda", "message", "mensagem", "community", "comunidade", "social", "agency", "agência", "marketing", "assistant", "bot"],
  },
  {
    id: "gift",
    name: { en: "Gift", pt: "Presente" },
    d: rr(26, 54, 68, 46, 7) + rr(20, 40, 80, 14, 5) + "M58 40C48 22 30 26 40 40Z" + "M62 40C72 22 90 26 80 40Z",
    eyes: { x: 60, y: 76, gap: 12, size: 0.95 },
    color: "#d946ef",
    words: ["gift", "presente", "store", "presentes", "birthday", "aniversário", "toys", "brinquedos", "surprise", "subscription box", "assinatura"],
  },
  {
    id: "bulb",
    name: { en: "Bulb", pt: "Lâmpada" },
    d: "M60 14C82 14 94 30 94 48C94 62 84 70 80 82H40C36 70 26 62 26 48C26 30 38 14 60 14Z" + rr(42, 86, 36, 8, 3) + rr(47, 97, 26, 8, 3),
    eyes: { x: 60, y: 46, gap: 12, size: 0.95 },
    color: "#facc15",
    words: ["idea", "ideia", "ideas", "consulting", "consultoria", "innovation", "inovação", "electric", "elétrica", "energy", "energia", "creative", "criativo", "lighting"],
  },
  {
    id: "pizza",
    name: { en: "Pizza", pt: "Pizza" },
    d: "M18 28C46 12 74 12 102 28L60 108Z",
    eyes: { x: 60, y: 42, gap: 11, size: 0.9 },
    color: "#fb923c",
    words: ["pizza", "pizzaria", "pizzeria", "pizzas", "food", "comida", "restaurant", "restaurante", "delivery", "fast food", "lanchonete", "snack", "burger", "hamburger", "hamburgueria", "lanches", "grill", "churrascaria", "bistro", "bar"],
  },
  {
    id: "cupcake",
    name: { en: "Cupcake", pt: "Cupcake" },
    d: "M32 66H88L81 102H39Z" + "M28 64C22 52 32 40 45 44C50 30 70 30 75 44C88 40 98 52 92 64Z",
    eyes: { x: 60, y: 82, gap: 11, size: 0.85 },
    color: "#f472b6",
    words: ["cake", "bolo", "bakery", "padaria", "confeitaria", "sweets", "doces", "dessert", "sobremesa", "cupcake", "brigadeiro", "candy"],
  },
  {
    id: "laptop",
    name: { en: "Laptop", pt: "Notebook" },
    d: rr(24, 26, 72, 50, 8) + "M12 80H108L102 92C101 94 99 95 97 95H23C21 95 19 94 18 92Z",
    eyes: { x: 60, y: 51, gap: 13, size: 1 },
    color: "#64748b",
    words: ["developer", "desenvolvedor", "dev", "code", "código", "it", "ti", "computer", "computador", "work", "trabalho", "freelancer", "remote", "office", "escritório"],
  },
  {
    id: "phone",
    name: { en: "Phone", pt: "Celular" },
    d: rr(34, 12, 52, 96, 14),
    eyes: { x: 60, y: 52, gap: 12, size: 1 },
    color: "#0f172a",
    words: ["phone", "celular", "mobile", "app", "telecom", "smartphone", "repair", "conserto", "assistência", "calls", "ligações"],
  },
  {
    id: "umbrella",
    name: { en: "Umbrella", pt: "Guarda-chuva" },
    d: "M14 60C14 34 36 18 60 18C84 18 106 34 106 60Z" + "M57 60H63V92C63 104 45 104 45 92H51C51 96 57 96 57 92Z",
    eyes: { x: 60, y: 44, gap: 13, size: 1 },
    color: "#0891b2",
    words: ["insurance", "seguro", "seguros", "protection", "proteção", "security", "segurança", "rain", "chuva", "travel", "viagem", "coverage"],
  },
  {
    id: "fish",
    name: { en: "Fish", pt: "Peixe" },
    d: "M12 60C28 36 72 34 90 60C72 86 28 84 12 60Z" + "M92 60L108 42V78Z",
    eyes: { x: 46, y: 58, gap: 9, size: 0.8 },
    color: "#0284c7",
    words: ["fish", "peixe", "sushi", "seafood", "frutos do mar", "aquarium", "aquário", "fishing", "pesca", "ocean", "oceano", "boat"],
  },
  {
    id: "ghost",
    name: { en: "Ghost", pt: "Fantasma" },
    d: "M28 100V52C28 30 44 18 60 18C76 18 92 30 92 52V100L82 92L71 100L60 92L49 100L38 92Z",
    eyes: { x: 60, y: 52, gap: 12, size: 1 },
    color: "#94a3b8",
    words: ["ghost", "fantasma", "halloween", "privacy", "privacidade", "anonymous", "anônimo", "horror", "terror", "mystery", "mistério"],
  },
  {
    id: "cat",
    name: { en: "Cat", pt: "Gato" },
    d: "M24 98V42L38 18L52 36H68L82 18L96 42V98C96 101 94 103 91 103H29C26 103 24 101 24 98Z",
    eyes: { x: 60, y: 64, gap: 14, size: 1 },
    color: "#78716c",
    words: ["cat", "gato", "gatos", "cats", "cattery", "gatil", "kitten", "filhote", "feline"],
  },
  {
    id: "sun",
    name: { en: "Sun", pt: "Sol" },
    d: circle(60, 60, 28) + rays(60, 60, 46, 7, 8),
    eyes: { x: 60, y: 60, gap: 10, size: 0.85 },
    color: "#f59e0b",
    words: ["sun", "sol", "solar", "summer", "verão", "beach", "praia", "tourism", "turismo", "hotel", "pousada", "vacation", "férias", "morning"],
  },
  {
    id: "leaf",
    name: { en: "Leaf", pt: "Folha" },
    d: "M60 12C94 30 102 72 60 108C18 72 26 30 60 12Z",
    eyes: { x: 60, y: 58, gap: 11, size: 0.9 },
    color: "#16a34a",
    words: ["organic", "orgânico", "vegan", "vegano", "natural", "sustainable", "sustentável", "farm", "fazenda", "agro", "health food", "salad", "salada", "herbal"],
  },
  {
    id: "toast",
    name: { en: "Toast", pt: "Pão" },
    d: "M26 56C14 52 16 26 40 24H80C104 26 106 52 94 56V98C94 101 92 103 89 103H31C28 103 26 101 26 98Z",
    eyes: { x: 60, y: 66, gap: 13, size: 1 },
    color: "#d97706",
    words: ["bread", "pão", "padaria", "bakery", "breakfast", "café da manhã", "sandwich", "sanduíche", "brunch", "toast"],
  },
  {
    id: "battery",
    name: { en: "Battery", pt: "Bateria" },
    d: rr(16, 36, 78, 48, 12) + rr(94, 50, 10, 20, 4),
    eyes: { x: 55, y: 60, gap: 13, size: 1 },
    color: "#10b981",
    words: ["battery", "bateria", "energy", "energia", "charge", "carga", "electric car", "carro elétrico", "power", "productivity", "produtividade"],
  },
  {
    id: "car",
    name: { en: "Car", pt: "Carro" },
    d: "M30 46L40 32C42 29 45 28 48 28H72C75 28 78 29 80 32L90 46H100C104 46 108 50 108 54V78C108 81 106 83 103 83H17C14 83 12 81 12 78V54C12 50 16 46 20 46Z" + circle(34, 94, 10) + circle(86, 94, 10),
    eyes: { x: 60, y: 60, gap: 13, size: 0.95 },
    color: "#dc2626",
    words: ["car", "carro", "auto", "automotive", "mechanic", "mecânica", "oficina", "taxi", "uber", "transport", "transporte", "driving school", "autoescola", "rental", "locadora"],
  },
  {
    id: "comb",
    name: { en: "Comb", pt: "Pente" },
    d: rr(18, 36, 84, 26, 10) + [26, 38, 50, 62, 74, 86].map((x) => rr(x, 64, 8, 34, 4)).join(""),
    eyes: { x: 60, y: 49, gap: 13, size: 0.9 },
    color: "#be185d",
    words: ["salon", "salão", "hair", "cabelo", "barber", "barbearia", "beauty", "beleza", "stylist", "cabeleireiro", "manicure"],
  },
];

const normal = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const tokens = (s: string) => normal(s).split(/[^a-z0-9]+/).filter(Boolean);

const near = (a: string, b: string) => {
  if (a === b || a === `${b}s` || b === `${a}s`) return 1;
  const short = Math.min(a.length, b.length);
  if (short < 4) return 0;
  let i = 0;
  while (i < short && a[i] === b[i]) i++;
  return i >= 4 && i / short >= 0.75 ? 0.6 : 0;
};

export function pickObject(description: string): MascotObject {
  const text = tokens(description);
  const joined = ` ${text.join(" ")} `;
  let best: MascotObject | null = null;
  let score = 0;
  for (const o of objects) {
    let s = 0;
    for (const word of o.words) {
      const w = tokens(word);
      if (w.length > 1) {
        if (joined.includes(` ${w.join(" ")} `)) s += w.join("").length * 1.5;
        continue;
      }
      let hit = 0;
      for (const t of text) hit = Math.max(hit, near(t, w[0]));
      s += hit * w[0].length;
    }
    if (s > score) {
      score = s;
      best = o;
    }
  }
  if (best) return best;
  let hash = 0;
  for (const c of text) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
  return objects[hash % objects.length];
}
