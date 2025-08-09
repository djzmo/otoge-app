import { Github, Heart } from "lucide-react";

interface FooterProps {
  sheetMode: boolean;
  className?: string;
}

export default function Footer({ className, sheetMode }: FooterProps) {
  return (
    <section className={className}>
      <div className="px-4 py-3 bg-zinc-100 border-t border-zinc-200 inline-flex w-full">
        {sheetMode && (
          <div className="nabla text-gray-300 mr-auto text-md">otoge.app</div>
        )}
        <div className="flex gap-1 justify-end max-w-md ml-auto text-gray-500 text-sm items-center">
          made with <Heart size={16} className="text-red-300" /> by{" "}
          <a
            href="https://github.com/djzmo/otoge-app"
            target="_blank"
            className="inline-flex items-center gap-1"
          >
            <Github size={16} /> djzmo
          </a>
        </div>
      </div>
    </section>
  );
}
