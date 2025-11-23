import Header from "@/components/header";
import PublicationsHero from "@/components/publications-hero";
import PublicationsGrid from "@/components/publications-grid";
import Footer from "@/components/footer";

// Mock data - replace with actual data fetching filtered by category
const mockPublications = [
  {
    id: "3",
    imageUrl: "/hero.jpeg",
    imageAlt: "Revista 1",
    category: "Revista",
    title: "Revista do Radialista - Edição Março 2024",
    date: "1 de março de 2024",
    link: "#",
  },
  {
    id: "8",
    imageUrl: "/hero.jpeg",
    imageAlt: "Revista 2",
    category: "Revista",
    title: "Revista do Radialista - Edição Fevereiro 2024",
    date: "1 de fevereiro de 2024",
    link: "#",
  },
];

export default function RevistasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <PublicationsHero
            badge="Revistas"
            title="Revista do Trabalhador"
            description="Acesse todas as edições da revista oficial do SITIBEGAM com reportagens, entrevistas e conteúdos especiais."
          />
        </div>
        <PublicationsGrid
          publications={mockPublications}
          defaultCategory="revistas"
        />
      </main>
      <Footer />
    </div>
  );
}
