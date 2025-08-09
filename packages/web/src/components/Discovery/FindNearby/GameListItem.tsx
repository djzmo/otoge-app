import Image from "next/image";
import { kebabCase } from "change-case";
import GameEnum from "@/domain/GameEnum";
import { toGameTitle } from "@/util/GameUtil";

interface GameListItem {
  game: GameEnum;
  onClick?: (game: GameEnum) => void;
}

export default function GameListItem({ game, onClick }: GameListItem) {
  const title = toGameTitle(game);
  return (
    <button
      type="button"
      disabled={onClick == null}
      onClick={() => {
        if (onClick) {
          onClick(game);
        }
      }}
      className="inline-flex items-center w-full border-b border-gray-300 gap-x-2 py-3 px-3 mx-1 text-sm text-left font-medium focus:bg-blue-100 bg-white hover:bg-blue-50 hover:border-blue-500 hover:rounded-lg transition-all duration-200"
    >
      <Image
        className="flex-shrink-0 size-12 rounded-full"
        src={`/assets/games/${kebabCase(game)}.webp`}
        alt={title}
        width={48}
        height={48}
      />
      <h2 className="text-lg text-gray-900 inline-flex items-center">
        {title}
      </h2>
    </button>
  );
}
