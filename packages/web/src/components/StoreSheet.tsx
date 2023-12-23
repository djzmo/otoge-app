import {Store} from "@otoge.app/shared";
import {FaX} from "react-icons/fa6";
import {useRef} from "react";
import {Sheet, SheetRef} from "@/components/sheets/Sheet";

interface StoreSheetProps {
    data?: Store
    isOpen: boolean
    onClose: () => void
}

export default function StoreSheet({ data, isOpen, onClose }: StoreSheetProps) {
    const sheetRef = useRef<SheetRef>(null)
    return (
        <Sheet isOpen={isOpen} ref={sheetRef} snapPoints={[300]}>
            <div className="flex flex-row gap-4">
                <button type="button"
                        onClick={onClose}
                        className="absolute right-4 top-[-0.3rem] bg-slate-500 rounded-full p-2 text-white">
                    <FaX />
                </button>
                <section className="px-5">
                    <h2>AAAA {data?.storeName}</h2>
                </section>
            </div>
        </Sheet>
    )
}
