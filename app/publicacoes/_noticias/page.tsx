import Header from "@/components/header";
import PublicationsHero from "@/components/publications-hero";
import PublicationsGrid from "@/components/publications-grid";
import Footer from "@/components/footer";

// Mock data - replace with actual data fetching filtered by category
const mockPublications = [
  {
    id: "1",
    imageUrl: "/hero.jpeg",
    imageAlt: "Notícia 1",
    category: "Notícia",
    title: "Assembleia define pauta de reivindicações para 2024",
    date: "10 de março de 2024",
    link: "#",
  },
  {
    id: "5",
    imageUrl: "/hero.jpeg",
    imageAlt: "Notícia 2",
    category: "Notícia",
    title: "Curso de capacitação abre inscrições",
    date: "25 de fevereiro de 2024",
    link: "#",
  },
  {
    id: "7",
    imageUrl: "/hero.jpeg",
    imageAlt: "Notícia 3",
    category: "Notícia",
    title: "Sindicato participa de congresso nacional",
    date: "15 de fevereiro de 2024",
    link: "#",
  },
  {
    id: "10",
    imageUrl: "/hero.jpeg",
    imageAlt: "Notícia 4",
    category: "Notícia",
    title: "Campanha salarial 2024 tem início",
    date: "20 de janeiro de 2024",
    link: "#",
  },
  {
    id: "12",
    imageUrl: "/hero.jpeg",
    imageAlt: "Notícia 5",
    category: "Notícia",
    title: "Parceria garante descontos em cursos",
    date: "10 de janeiro de 2024",
    link: "#",
  },
];

export default function NoticiasPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <PublicationsHero
            badge="Notícias"
            title="Acompanhe as últimas notícias do sindicato"
            description="Fique informado sobre as conquistas, eventos e ações do SITIBEGAM em defesa da categoria."
          />
        </div>
        <PublicationsGrid
          publications={mockPublications}
          defaultCategory="noticias"
        />
      </main>
      <Footer />
    </div>
  );
}
