import Image from "next/image";
import { Gamepad2 } from "lucide-react";

interface StoreIconProps {
  brand?: string;
}

export default function StoreIcon({ brand }: StoreIconProps) {
  return (
    <>
      {brand != null && (
        <div className="flex-none border-2 rounded-full">
          <Image
            src={`/assets/stores/${brand}.webp`}
            alt={brand}
            className="flex-shrink-0 size-12 rounded-full"
            width={48}
            height={48}
          />
        </div>
      )}

      {brand == null && (
        <div className="flex-none bg-slate-800 text-white rounded-full p-3 border-2">
          <Gamepad2 size="1.5rem" />
        </div>
      )}
    </>
  );
}
