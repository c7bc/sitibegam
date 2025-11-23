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
                <svg width="50" height="55" viewBox="0 0 285 285" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M132.845 0.267956C253.744 -6.85604 327.736 129.604 256.692 226.769C234.719 256.822 200.873 278.282 163.91 283.46C138.531 287.016 142.667 285.041 139.403 262.187L132.959 213.967L128.784 182.877C128.313 179.421 125.431 161.672 127.094 159.511C128.944 157.108 143.939 157.958 147.623 158.011C147.166 139.524 145.483 131.356 131.757 117.875C123.785 109.174 122.542 103.036 122.587 91.5639C122.625 81.9469 122.649 72.177 122.552 62.561L102.356 62.6219C102.22 73.6259 103.014 93.637 101.353 103.666C99.3083 116.013 80.8063 125.518 78.8173 141.228C76.9713 155.804 77.6903 172.021 77.7123 186.67L77.9913 269.486C68.1083 264.45 58.8583 258.258 50.4363 251.041C-46.3767 169.253 4.40828 10.798 132.845 0.267956ZM68.4383 252.412C68.3523 231.779 68.4343 211.146 68.6873 190.514C68.7553 169.345 64.6513 135.85 79.0163 119.372C93.2903 102.997 93.3733 106.252 93.4203 84.396C93.4543 75.022 93.4213 65.6479 93.3223 56.2749C93.1883 41.1459 90.5863 33.466 109.297 34.914C113.912 35.271 120.161 34.768 124.92 34.945C126.774 35.009 128.514 35.8519 129.714 37.2669C133.386 41.5159 131.885 64.311 131.805 71.562C131.715 80.584 131.063 91.642 132.387 100.547C133.08 105.21 138.094 110.706 141.335 113.897C154.867 127.092 156.65 139.804 156.533 157.987C163.888 157.675 214.568 157.17 218.936 158.59C220.598 160.677 220.256 165.863 219.946 168.468C217.215 191.416 214.271 214.317 211.066 237.202C210.141 243.814 209.144 250.819 208.973 257.46C213.734 254.94 221.435 248.965 225.597 245.482C246.32 228.141 260.984 207.458 268.939 181.554C279.399 147.431 275.719 110.537 258.726 79.1519C242.579 48.7369 212.701 25.1149 179.866 15.1799C167.667 11.4889 146.874 8.03695 134.094 9.73895C12.5823 21.5479 -34.5827 166.35 59.0013 245.625C61.9913 248.158 65.1593 250.271 68.4383 252.412ZM156.645 274.702C170.624 273.28 185.073 269.576 197.754 263.451C199.944 259.742 205.877 209.984 206.274 203.351C187.203 210.16 175.515 199.886 156.71 195.448L156.667 240.4C156.623 251.478 156.244 263.811 156.645 274.702ZM156.675 186.273C175.15 186.522 187.123 204.029 207.699 193.262C209.217 184.823 209.849 176.089 211.316 167.471C195.133 166.379 173.525 167.506 156.624 167.126L156.675 186.273ZM135.857 167.11C136.694 172.466 137.78 184.688 139.042 188.915C142.063 187.868 143.745 187.386 146.862 186.666L147.494 186.063C147.454 179.747 147.449 173.43 147.478 167.113C143.679 167.102 139.633 167.019 135.857 167.11ZM147.727 254C147.696 248.991 147.496 242.931 147.697 238.004C147.705 224.042 147.64 210.08 147.502 196.118L139.842 198.456C142.012 211.641 143.868 224.875 145.41 238.148C145.988 243.071 146.543 249.297 147.727 254ZM102.221 44.194L102.368 53.2769C109.114 53.1099 115.863 53.07 122.61 53.158L122.603 44.3489C115.695 44.1149 108.969 44.373 102.221 44.194Z" fill="white"/>
                  <path d="M188.329 78.814C193.117 83.104 207.361 109.585 208.631 116.953C210.74 129.195 201.725 138.434 189.701 140.069C185.068 140.056 179.388 138.642 175.641 135.786C158.064 122.392 178.331 92.422 188.329 78.814ZM177.749 123.54C180.95 128.385 182.897 130.005 188.839 130.649C196.623 129.289 199.887 124.886 198.963 117.431C198.518 113.845 190.707 97.896 188.552 95.966C183.276 104.127 176.743 113.469 177.714 123.223L177.749 123.54Z" fill="white"/>
                  <path d="M145.41 238.148L147.697 238.004C147.496 242.931 147.696 248.991 147.727 254C146.543 249.297 145.988 243.071 145.41 238.148Z" fill="white" fillOpacity="0.0117647"/>
                  <path d="M100.287 123.461C102.333 124.921 104.759 128.49 106.3 130.61C95.5264 140.931 95.7604 146.92 95.8054 161.227C95.8294 168.788 95.7754 176.722 95.7764 184.318L95.8374 260.657C95.8404 262.689 96.1304 275.57 95.6394 276.655L94.8854 276.637C91.5064 275.408 89.7204 274.572 86.5154 272.925C87.0334 262.828 86.6884 249.861 86.6894 239.532L86.6844 178.396C86.6834 169.502 86.4594 160.083 86.8094 151.244C87.3154 138.442 90.9844 131.89 100.287 123.461Z" fill="white"/>
                </svg>
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
