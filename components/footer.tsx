import type { FooterContent } from "@/types/payload";

interface FooterProps {
  content?: FooterContent;
}

// Default content for fallback
const defaultContent: FooterContent = {
  description: "Representando e defendendo os direitos dos trabalhadores da indústria de bebidas com força e dedicação.",
  navItems: [
    { label: "Início", href: "/" },
    { label: "Sindicato", href: "/sindicato" },
    { label: "Jurídico", href: "/juridico" },
    { label: "Publicações", href: "/publicacoes" },
    { label: "Serviços", href: "/servicos" },
    { label: "Contato", href: "/contato" },
  ],
  socialLinks: {
    twitter: "https://x.com/",
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    youtube: "https://www.youtube.com/",
  },
};

export default function Footer({ content }: FooterProps) {
  const data = content || defaultContent;

  return (
    <footer className="bg-brand-section py-12 md:pt-16">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col justify-between gap-x-8 gap-y-12 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-6 md:max-w-sm">
            {/* Logo do Sindicato */}
            <div className="flex h-8 w-max items-center justify-start overflow-visible">
              <a className="flex items-center gap-2 text-white" href="/">
                <img src="/image.png" alt="SITIBEGAM Logo" width="50" height="55" />
                <div className="flex flex-col text-sm font-semibold">
                  <span>SITIBEGAM</span>
                  <span>BELÉM - PA</span>
                </div>
              </a>
            </div>
            <p className="text-md text-white">
              {data.description}
            </p>
          </div>

          <nav>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3 lg:grid-cols-[repeat(6,max-content)]">
              {data.navItems.map((item, index) => (
                <li key={index}>
                  <a
                    className="group relative inline-flex h-max cursor-pointer items-center whitespace-nowrap outline-brand transition duration-100 ease-linear before:absolute focus-visible:outline-2 focus-visible:outline-offset-2 justify-normal rounded p-0! gap-1.5 text-white hover:text-white/80"
                    href={item.href}
                  >
                    <span className="underline decoration-transparent underline-offset-2 hover:decoration-current transition-inherit-all">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse justify-between gap-6 border-t border-brand_alt pt-8 md:mt-16 md:flex-row">
          <p className="text-md text-white">
            © 2025 SITIBEGAM - Sindicato dos Trabalhadores de Bebidas em Geral. Todos os direitos reservados.
          </p>
          <ul className="flex gap-6">
            {data.socialLinks.twitter && (
              <li>
                <a
                  href={data.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-xs text-white outline-focus-ring transition duration-100 ease-linear hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 22" fill="none" aria-label="X (formerly Twitter)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.9455 22L10.396 14.0901L3.44886 22H0.509766L9.09209 12.2311L0.509766 0H8.05571L13.286 7.45502L19.8393 0H22.7784L14.5943 9.31648L23.4914 22H15.9455ZM19.2185 19.77H17.2398L4.71811 2.23H6.6971L11.7121 9.25316L12.5793 10.4719L19.2185 19.77Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
            )}
            {data.socialLinks.facebook && (
              <li>
                <a
                  href={data.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-xs text-white outline-focus-ring transition duration-100 ease-linear hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Facebook">
                    <path
                      d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.3882 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9166 4.6875 14.6576 4.6875C15.9701 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80008 13.875 9.75V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
            )}
            {data.socialLinks.instagram && (
              <li>
                <a
                  href={data.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-xs text-white outline-focus-ring transition duration-100 ease-linear hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="Instagram">
                    <path
                      d="M12 2.16094C15.2063 2.16094 15.5859 2.175 16.8469 2.23125C18.6187 2.31563 19.6219 2.70469 20.3156 2.99531C21.2219 3.36563 21.8969 3.80625 22.5938 4.50313C23.2906 5.2 23.7313 5.875 24.1016 6.78125C24.3922 7.475 24.7812 8.47813 24.8656 10.25C24.9219 11.5109 24.9359 11.8906 24.9359 15.0969C24.9359 18.3031 24.9219 18.6828 24.8656 19.9438C24.7812 21.7156 24.3922 22.7188 24.1016 23.4125C23.7313 24.3188 23.2906 24.9938 22.5938 25.6906C21.8969 26.3875 21.2219 26.8281 20.3156 27.1984C19.6219 27.4891 18.6187 27.8781 16.8469 27.9625C15.5859 28.0188 15.2063 28.0328 12 28.0328C8.79375 28.0328 8.41406 28.0188 7.15313 27.9625C5.38125 27.8781 4.37813 27.4891 3.68438 27.1984C2.77813 26.8281 2.10313 26.3875 1.40625 25.6906C0.709375 24.9938 0.26875 24.3188 -0.101562 23.4125C-0.392187 22.7188 -0.78125 21.7156 -0.865625 19.9438C-0.921875 18.6828 -0.935937 18.3031 -0.935937 15.0969C-0.935937 11.8906 -0.921875 11.5109 -0.865625 10.25C-0.78125 8.47813 -0.392187 7.475 -0.101562 6.78125C0.26875 5.875 0.709375 5.2 1.40625 4.50313C2.10313 3.80625 2.77813 3.36563 3.68438 2.99531C4.37813 2.70469 5.38125 2.31563 7.15313 2.23125C8.41406 2.175 8.79375 2.16094 12 2.16094ZM12 0C8.74219 0 8.33437 0.0140625 7.05469 0.0703125C5.775 0.126563 4.90313 0.52500 4.14375 1.00781C3.35156 1.49063 2.68125 2.08594 2.01094 2.75625C1.34063 3.42656 0.745312 4.09687 0.2625 4.88906C-0.220313 5.64844 -0.618750 6.52031 -0.675000 7.8C-0.731250 9.07969 -0.745312 9.48750 -0.745312 12.7453C-0.745312 16.0031 -0.731250 16.4109 -0.675000 17.6906C-0.618750 18.9703 -0.220313 19.8422 0.2625 20.6016C0.745312 21.3938 1.34063 22.0641 2.01094 22.7344C2.68125 23.4047 3.35156 23.9906 4.14375 24.4828C4.90313 24.9656 5.775 25.3641 7.05469 25.4203C8.33437 25.4766 8.74219 25.4906 12 25.4906C15.2578 25.4906 15.6656 25.4766 16.9453 25.4203C18.225 25.3641 19.0969 24.9656 19.8562 24.4828C20.6484 23.9906 21.3187 23.4047 21.9891 22.7344C22.6594 22.0641 23.2453 21.3938 23.7375 20.6016C24.2203 19.8422 24.6187 18.9703 24.675 17.6906C24.7312 16.4109 24.7453 16.0031 24.7453 12.7453C24.7453 9.48750 24.7312 9.07969 24.675 7.8C24.6187 6.52031 24.2203 5.64844 23.7375 4.88906C23.2547 4.09687 22.6594 3.42656 21.9891 2.75625C21.3187 2.08594 20.6484 1.5 19.8562 1.00781C19.0969 0.525 18.225 0.126562 16.9453 0.0703125C15.6656 0.0140625 15.2578 0 12 0Z"
                      fill="currentColor"
                    />
                    <path
                      d="M12 6.35156C8.59688 6.35156 5.85938 9.08906 5.85938 12.4922C5.85938 15.8953 8.59688 18.6328 12 18.6328C15.4031 18.6328 18.1406 15.8953 18.1406 12.4922C18.1406 9.08906 15.4031 6.35156 12 6.35156ZM12 16.4734C9.79219 16.4734 8.01875 14.7 8.01875 12.4922C8.01875 10.2844 9.79219 8.51094 12 8.51094C14.2078 8.51094 15.9812 10.2844 15.9812 12.4922C15.9812 14.7 14.2078 16.4734 12 16.4734Z"
                      fill="currentColor"
                    />
                    <path
                      d="M19.8469 6.10781C19.8469 6.96563 19.1531 7.65938 18.2953 7.65938C17.4375 7.65938 16.7437 6.96563 16.7437 6.10781C16.7437 5.25 17.4375 4.55625 18.2953 4.55625C19.1531 4.55625 19.8469 5.25 19.8469 6.10781Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
            )}
            {data.socialLinks.youtube && (
              <li>
                <a
                  href={data.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex rounded-xs text-white outline-focus-ring transition duration-100 ease-linear hover:text-white/80 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-label="YouTube">
                    <path
                      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
