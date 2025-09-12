import { Github, Twitter, Linkedin } from "lucide-react";

export default function HeaderDev() {
  return (
    <header className="flex justify-between items-center gap-2 py-8 text-gray-800">
      <h1 className="text-xl font-semibold ">TrendsAI</h1>
      <div className="flex gap-4 text-zinc-500">
        <a
          href="https://github.com/luisdev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-800 transition"
        >
          <Github />
        </a>
        <a
          href="https://twitter.com/luisdev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-800 transition"
        >
          <Twitter />
        </a>
        <a
          href="https://linkedin.com/in/luisdev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-800 transition"
        >
          <Linkedin />
        </a>
      </div>
    </header>
  );
}
