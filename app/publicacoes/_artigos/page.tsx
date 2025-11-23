import Header from "@/components/header";
import PublicationsHero from "@/components/publications-hero";
import PublicationsGrid from "@/components/publications-grid";
import Footer from "@/components/footer";

// Mock data - replace with actual data fetching filtered by category
const mockPublications = [
  {
    id: "2",
    imageUrl: "/hero.jpeg",
    imageAlt: "Artigo 1",
    category: "Artigo",
    title: "O futuro da radiodifusão no Brasil",
    date: "8 de março de 2024",
    link: "#",
  },
  {
    id: "6",
    imageUrl: "/hero.jpeg",
    imageAlt: "Artigo 2",
    category: "Artigo",
    title: "A importância da sindicalização",
    date: "20 de fevereiro de 2024",
    link: "#",
  },
  {
    id: "11",
    imageUrl: "/hero.jpeg",
    imageAlt: "Artigo 3",
    category: "Artigo",
    title: "Tecnologia e tradição na radiodifusão",
    date: "15 de janeiro de 2024",
    link: "#",
  },
];

export default function ArtigosPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <PublicationsHero
            badge="Artigos"
            title="Análises e reflexões sobre a categoria"
            description="Leia artigos de especialistas e lideranças sindicais sobre temas relevantes para os trabalhadores de bebidas."
          />
        </div>
        <PublicationsGrid
          publications={mockPublications}
          defaultCategory="artigos"
        />
      </main>
      <Footer />
    </div>
  );
}
