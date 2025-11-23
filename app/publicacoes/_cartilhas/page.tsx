import Header from "@/components/header";
import PublicationsHero from "@/components/publications-hero";
import PublicationsGrid from "@/components/publications-grid";
import Footer from "@/components/footer";

// Mock data - replace with actual data fetching filtered by category
const mockPublications = [
  {
    id: "4",
    imageUrl: "/hero.jpeg",
    imageAlt: "Cartilha 1",
    category: "Cartilha",
    title: "Direitos Trabalhistas dos Radialistas",
    date: "28 de fevereiro de 2024",
    link: "#",
  },
  {
    id: "9",
    imageUrl: "/hero.jpeg",
    imageAlt: "Cartilha 2",
    category: "Cartilha",
    title: "Saúde e segurança no trabalho",
    date: "25 de janeiro de 2024",
    link: "#",
  },
];

export default function CartilhasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <PublicationsHero
            badge="Cartilhas"
            title="Materiais informativos e educativos"
            description="Baixe cartilhas e guias sobre direitos trabalhistas, saúde, segurança e outros temas importantes para a categoria."
          />
        </div>
        <PublicationsGrid
          publications={mockPublications}
          defaultCategory="cartilhas"
        />
      </main>
      <Footer />
    </div>
  );
}
