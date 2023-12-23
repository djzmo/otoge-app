import {FaLocationArrow, FaMagnifyingGlass} from "react-icons/fa6";
import SearchListItem from "@/components/SearchListItem";
import {ChangeEvent, useRef, useState} from "react";
import {GameEnum, Store} from "@otoge.app/shared";
import {Sheet, SheetRef} from "@/components/sheets/Sheet";
import {SheetHeader} from "@/components/sheets/SheetHeader";
import {SheetBody} from "@/components/sheets/SheetBody";

enum SheetState {
    DEFAULT,
    SEARCH_PREVIEW,
    SEARCH_RESULT
}

interface MainSheetProps {
    onSelectStore: (data: Store) => void
    className?: string
}

export default function MainSheet({ onSelectStore, className }: MainSheetProps) {
    const [currentSnap, setCurrentSnap] = useState(1)
    const [isSearchFocused, setIsSearchFocused] = useState(false)
    const [sheetState, setSheetState] = useState(SheetState.DEFAULT)
    const [searchKeyword, setSearchKeyword] = useState("")
    const sheetRef = useRef<SheetRef>(null)
    const dummyStore: Store = {
        "country": "JP",
        "area": "長野県",
        "storeName": "HapipiLand佐久",
        "address": "長野県佐久市岩村田6-2佐久ステーションパーク内",
        "lat": 36.2894727,
        "lng": 138.4868869,
        "cabinets": [
            {
                "game": GameEnum.CHUNITHM
            },
            {
                "game": GameEnum.ONGEKI
            },
            {
                "game": GameEnum.DANCEDANCEREVOLUTION
            }
        ],
        "context": {
            "allNetCt": "1000",
            "allNetAt": "19",
            "allNetSid": "19636",
            "eAmusementFdesc": "6a8525b6b4d27c2851ef105a4d2bc5bd"
        },
        "alternateArea": "NAGANO KEN",
        "alternateStoreName": "HAPIPILAND SAKU",
        "alternateAddress": "NAGANO KEN SAKU SHI IWAMURADA 6 - 2 SAKU SUTESHON PAKU NAI"
    }
    const snapTo = (pxOrPercentage: number | string) => sheetRef.current?.snapTo(pxOrPercentage)
    const onSearchFocus = () => {
        snapTo('90')
    }
    const onSearchBlur = () => {
        if (searchKeyword.length < 2) {
            setSearchKeyword('')
            snapTo(300)
        }
    }
    const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(e.target.value)
        setIsSearchFocused(e.target.value.length > 0)
        if (e.target.value.length >= 2) {
            setSheetState(SheetState.SEARCH_PREVIEW)
        } else {
            setSheetState(SheetState.DEFAULT)
        }
    }
    const onCancelSearch = () => {
        setSheetState(SheetState.DEFAULT)
        setSearchKeyword("")
        setIsSearchFocused(false)
        snapTo(300)
    }
    const onSheetSnap = (snapIndex: number) => {
        setCurrentSnap(snapIndex)
    }
    const onSearchNearest = () => {
        snapTo(100)
        setSheetState(SheetState.SEARCH_RESULT)
    }
    const onSearchListItemClick = (data: Store) => {
        snapTo(100)
        onSelectStore(data)
    }
    return (
        <Sheet isOpen={true} ref={sheetRef} snapPoints={[100, 300, '90']} initialSnap={300}>
            <SheetHeader />
            <SheetBody>
                <div className="flex flex-col gap-4">
                    <section className="px-5">
                        <div className="flex">
                            <div
                                className="absolute pointer-events-none z-20 pt-3.5 pl-4 text-white">
                                <FaMagnifyingGlass />
                            </div>
                            <input type="text" id="hs-leading-icon" name="hs-leading-icon"
                                   className="inline-flex py-3 px-4 pl-11 block w-full border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400"
                                   placeholder="Search location"
                                   value={searchKeyword}
                                   onChange={onSearchChange}
                                   onBlur={onSearchBlur}
                                   onFocus={onSearchFocus} />
                            {isSearchFocused ? <button type="button" className="inline-flex justify-center items-center ml-3" onClick={onCancelSearch}>
                                Cancel
                            </button> : <></>}
                        </div>
                    </section>
                    <section className={`h-full overflow-y-auto border border-t-gray-400 ${sheetState !== SheetState.SEARCH_PREVIEW ? "hidden" : ""}`}>
                        <div className="max-w flex flex-col">
                            <SearchListItem data={dummyStore} onClick={onSearchListItemClick} />
                        </div>
                    </section>
                    <section className={`px-5 ${sheetState !== SheetState.DEFAULT ? "hidden" : ""}`}>
                        <h3>Games</h3>
                        <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                            <div className="p-4 md:p-5">
                                <p className="mt-2 text-gray-800 dark:text-gray-400">
                                    With supporting text below as a natural lead-in to additional content.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className={`px-5 ${sheetState !== SheetState.DEFAULT ? "hidden" : ""}`}>
                        <h3>Games</h3>
                        <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                            <div className="p-4 md:p-5">
                                <p className="mt-2 text-gray-800 dark:text-gray-400">
                                    With supporting text below as a natural lead-in to additional content.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className={`px-5 ${sheetState !== SheetState.DEFAULT ? "hidden" : ""}`}>
                        <h3>Games</h3>
                        <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                            <div className="p-4 md:p-5">
                                <p className="mt-2 text-gray-800 dark:text-gray-400">
                                    With supporting text below as a natural lead-in to additional content.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className={`px-5 ${sheetState !== SheetState.DEFAULT ? "hidden" : ""}`}>
                        <h3>Games</h3>
                        <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                            <div className="p-4 md:p-5">
                                <p className="mt-2 text-gray-800 dark:text-gray-400">
                                    With supporting text below as a natural lead-in to additional content.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className={`px-5 ${sheetState !== SheetState.DEFAULT ? "hidden" : ""}`}>
                        <h3>Games</h3>
                        <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                            <div className="p-4 md:p-5">
                                <p className="mt-2 text-gray-800 dark:text-gray-400">
                                    With supporting text below as a natural lead-in to additional content.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className={`px-5 ${sheetState !== SheetState.DEFAULT ? "hidden" : ""}`}>
                        <h3>Games</h3>
                        <div
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
                            <div className="p-4 md:p-5">
                                <p className="mt-2 text-gray-800 dark:text-gray-400">
                                    With supporting text below as a natural lead-in to additional content.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className={`px-5 absolute bottom-0 ${sheetState !== SheetState.DEFAULT ? "hidden" : ""}`}>
                        made with
                    </section>
                </div>
                <button type="button"
                        className={`${currentSnap === 0 ? "hidden" : ""} absolute right-3 top-[-4rem] rounded-full py-4 px-4 inline-flex justify-center items-center gap-2 rounded-md bg-gray-100 border border-transparent font-semibold text-gray-800 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 ring-offset-white focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:bg-gray-700 dark:hover:bg-gray-900 dark:text-white`}>
                    <FaLocationArrow />
                </button>
            </SheetBody>
        </Sheet>
    )
}