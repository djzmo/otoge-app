import React from "react";
import {useSheetContext} from "@/components/sheets/hooks";

export const SheetHeader = function() {
    const { bind } = useSheetContext()

    return (
        <div className="react-spring-sheets-header" {...bind()}>
            <div className="react-spring-sheets-header-handle"></div>
        </div>
    )
}
