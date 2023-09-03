import {FaGamepad} from "react-icons/fa6";
import {Store} from "@otoge.app/shared";

interface SearchListItemProps {
    data: Store
    onClick: (data: Store) => void
}

export default function SearchListItem({ data, onClick }: SearchListItemProps) {
    return (
        <button type="button"
                onClick={() => onClick(data)}
                className="inline-flex items-center border-b border-b-gray-300 gap-x-2 py-3 mx-3 px-1 text-sm text-left font-medium text-blue-600 -mt-px first:mt-0 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-600">
            <div className="flex-none bg-slate-800 text-white rounded-full p-3">
                <FaGamepad size="1.25rem" />
            </div>
            <div className="flex flex-col">
                <h2 className="text-lg">GiGO Shibuya</h2>
                <p>Address 234</p>
            </div>
        </button>
    )
}