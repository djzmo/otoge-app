import {SpringRef} from "@react-spring/web";
import {createContext, useContext} from "react";
import {ReactDOMAttributes} from "@use-gesture/react/dist/declarations/src/types";

export interface SheetSpringProps {
    y: number
}

export interface SheetContextProps {
    api: SpringRef<SheetSpringProps>
    bind: (...args: any) => ReactDOMAttributes
    open: () => void
    close: (velocity: number) => void
}

export const SheetContext = createContext<SheetContextProps | undefined>(undefined)
