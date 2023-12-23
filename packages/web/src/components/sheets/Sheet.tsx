import React, {PropsWithChildren, useCallback, useMemo, useRef} from 'react'
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle } from 'react'
import {animated, config, useIsomorphicLayoutEffect, useSpring} from '@react-spring/web'
import {SheetContext} from "@/components/sheets/SheetContext";
import {useDrag} from "@use-gesture/react";
import {useSnap} from "@/components/sheets/hooks";

export interface SheetRef {
    snapTo: (pxOrPercentage: number | string) => void
}

export interface SheetProps {
    snapPoints: (number | string)[]
    initialSnap?: number | string
    isOpen: boolean
}

export const Sheet = forwardRef<SheetRef, PropsWithChildren<SheetProps>>(function Sheet(
    { snapPoints, initialSnap, isOpen, children }: PropsWithChildren<SheetProps>,
    forwardRef: ForwardedRef<SheetRef>,
) {
    const { calcPx, findClosestSnap, minSnapPoint, maxSnapPoint } = useSnap(snapPoints)
    const initialSnapPxRef = useRef(0)
    const currentHeightRef = useRef(0)
    const [{ y }, api] = useSpring(() => ({ y: 0 }))

    const snapTo = useCallback((height: number, velocity: number) => {
        currentHeightRef.current = height
        api.start({ y: -height, immediate: false, config: { ...config.stiff, velocity } })
    }, [api])
    const open = useCallback(() => snapTo(currentHeightRef.current, 0), [snapTo])
    const close = useCallback((velocity = 0) => snapTo(0, velocity), [snapTo])
    const display = y.to((py) => (py < 0 ? 'block' : 'none'))
    const bind = useDrag(
        ({ last, velocity: [, vy], direction: [, dy], offset: [, oy], cancel, canceled }) => {
            // if the user drags up passed a threshold, then we cancel
            // the drag so that the sheet resets to its open position
            if (oy < -maxSnapPoint - 10) {
                oy = -maxSnapPoint - 10
            } else if (oy > -minSnapPoint + 10) {
                oy = -minSnapPoint + 10
            }

            // when the user releases the sheet, we check whether it passed
            // the threshold for it to close, or if we reset it to its open positino
            if (last) {
                const closestSnapHeight = findClosestSnap(Math.abs(oy))
                if (closestSnapHeight !== currentHeightRef.current) {
                    snapTo(closestSnapHeight, vy)
                } else if (vy > 0.5 && dy > 0) {
                    snapTo(minSnapPoint, vy)
                } else {
                    snapTo(currentHeightRef.current, vy)
                }
                // Math.abs(oy) < nextSnapHeight * 0.75 || Math.abs(oy) > nextSnapHeight * 0.75 || (vy > 0.5 && dy > 0) ?
                //     snapToIndex(closestSnapIndex, vy) : open()
            }
            // when the user keeps dragging, we just move the sheet according to
            // the cursor position
            else api.start({ y: oy, immediate: true })
        },
        { from: () => [0, y.get()], filterTaps: true },
    )

    useImperativeHandle(forwardRef, () => ({
        snapTo: (pxOrPercentage: number | string) => {
            snapTo(findClosestSnap(pxOrPercentage), 0.25)
        },
    }))

    useEffect(() => {
        initialSnapPxRef.current = initialSnap ? calcPx(initialSnap) : 0
        currentHeightRef.current = initialSnapPxRef.current
        if (isOpen) {
            open()
        } else {
            close()
        }
    }, [calcPx, close, initialSnap, isOpen, open])

    return <SheetContext.Provider value={{ api, bind, open, close }}>
        <animated.div className="react-spring-sheets-sheet" style={{ display, bottom: `calc(-100vh - 100px)`, y }}>
            {children}
        </animated.div>
    </SheetContext.Provider>
})
