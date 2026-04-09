import Parser from "html-react-parser";

const BoxingOctopusUrl =
  '<a href="https://boxingoctop.us" target="_blank" rel="noreferrer">Boxing Octopus Creative</a>';
const FlaskUrl = '<a href="https://flask.palletsprojects.com" target="_blank" rel="noreferrer">Flask</a>';
const NextUrl = '<a href="https://nextjs.org" target="_blank" rel="noreferrer">Next.js</a>';
const TailwindUrl = '<a href="https://tailwindcss.com" target="_blank" rel="noreferrer">Tailwind</a>';
const GithubUrl =
  '<a href="https://github.com/BoxingOctopus/chains-invent-insanity" target="_blank" rel="noreferrer">GitHub</a>';

export function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <footer className="page-footer px-3 py-2.5 text-center text-[11px] leading-snug sm:px-4 sm:py-3 sm:text-sm sm:leading-normal">
        <span className="inline-block max-w-[min(100%,42rem)]">
          Another fine {Parser(BoxingOctopusUrl)} Project | Built with {Parser(FlaskUrl)}, {Parser(NextUrl)}, and{" "}
          {Parser(TailwindUrl)} | Clone this project on {Parser(GithubUrl)}
        </span>
      </footer>
    </div>
  );
}
