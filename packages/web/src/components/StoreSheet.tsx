import Sheet from "react-modal-sheet";
import {Store} from "@otoge.app/shared";
import {FaX} from "react-icons/fa6";

interface StoreSheetProps {
    data?: Store
    isOpen: boolean
    onClose: () => void
}

export default function StoreSheet({ data, isOpen, onClose }: StoreSheetProps) {
    return (
        <Sheet isOpen={isOpen} onClose={onClose} snapPoints={[1, 350, 100]} initialSnap={1}>
            <Sheet.Container className="!rounded-2xl">
                <Sheet.Header />
                <Sheet.Content className="flex flex-row gap-4">
                    <button type="button"
                            onClick={onClose}
                            className="absolute right-4 top-[-0.3rem] bg-slate-500 rounded-full p-2 text-white">
                        <FaX />
                    </button>
                    <section className="px-5">
                        <h2>{data?.storeName}</h2>
                    </section>
                </Sheet.Content>
            </Sheet.Container>
        </Sheet>
    )
}