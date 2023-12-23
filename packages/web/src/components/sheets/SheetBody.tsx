import {PropsWithChildren} from "react";
import {useSheetContext} from "@/components/sheets/hooks";

export interface SheetBodyProps {
    draggable?: boolean
}

const height = 5 * 60 + 80
export const SheetBody = function({ children, draggable = true }: PropsWithChildren<SheetBodyProps>) {
    const { bind } = useSheetContext()

    return (
        <div className="react-spring-sheets-body" {...(draggable && bind())}>
            {children}
        </div>
    )
}
