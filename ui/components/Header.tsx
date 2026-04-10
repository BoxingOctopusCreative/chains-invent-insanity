import Image from "next/image";

const logoSrc =
  "https://ci2-assets.chainsinventinsanity.lol/images/Logo%20White.png";

export function Header() {
  return (
    <header className="page-header">
      <div className="jumbotron jumbotron-fluid">
        <div className="flex flex-col gap-2 text-xl font-bold sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:text-2xl md:text-4xl">
          <span>Welcome to</span>
          <Image
            src={logoSrc}
            alt="Chains Invent Insanity"
            width={400}
            height={70}
            className="img-fluid h-auto w-auto max-w-[min(100%,min(280px,85vw))] sm:max-w-none"
            priority
            unoptimized
          />
        </div>
        <p className="mt-3 text-left text-sm font-bold leading-relaxed sm:text-base">
          Chains Invent Insanity is a{" "}
          <a href="https://cardsagainsthumanity.lol" target="_blank" rel="noreferrer">
            Cards Against Humanity
          </a>{" "}
          answer card generator.
          <br />
          As the name suggests, it generates cards based on a{" "}
          <a href="https://www.wikiwand.com/en/Markov_chain" target="_blank" rel="noreferrer">
            Markov Chain{" "}
          </a>
          compiled from a wordlist.
          <br />
          This wordlist is comprised of every single (official) answer card ever written for every edition of the
          game.
        </p>
      </div>
    </header>
  );
}
