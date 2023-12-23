import {useCallback, useContext, useState} from "react";
import {SheetContext} from "@/components/sheets/SheetContext";
import {useIsomorphicLayoutEffect} from "@react-spring/web";

export const useSheetContext = function() {
    const sheetContext = useContext(SheetContext)
    if (!sheetContext) {
        throw Error('SheetContext does not exist')
    }
    return sheetContext
}

export const useSnap = function(snapPoints: (number | string)[]) {
    const maxHeight = useMaxHeight()
    const calcPx = useCallback((pxOrPercentage: number | string) => typeof pxOrPercentage === 'string' ? Math.round(parseFloat(pxOrPercentage) * maxHeight / 100.0) : pxOrPercentage, [maxHeight])
    const absSnapPoints = snapPoints.map(calcPx)
    const minSnapPoint = Math.min(...absSnapPoints)
    const maxSnapPoint = Math.max(...absSnapPoints)
    const findClosestSnap = useCallback((pxOrPercentage: number | string): number => {
        const height = calcPx(pxOrPercentage)
        return absSnapPoints.reduce((prev, current) => {
            return Math.abs(current - height) < Math.abs(prev - height) ? current : prev
        }, Math.min(...absSnapPoints))
    }, [absSnapPoints, calcPx])

    return { maxHeight, findClosestSnap, calcPx, minSnapPoint, maxSnapPoint }
}

export const useMaxHeight = function() {
    const [maxHeight, setMaxHeight] = useState(0)
    useIsomorphicLayoutEffect(() => {
        const resizeHandler = () => setMaxHeight(window.innerHeight)
        window.addEventListener('resize', resizeHandler)
        resizeHandler()
        return () => window.removeEventListener('resize', resizeHandler)
    }, [])
    return maxHeight
}
