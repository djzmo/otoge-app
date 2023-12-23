import React from 'react'
import { ForwardedRef, forwardRef, ReactElement, useEffect, useImperativeHandle } from 'react'
import { animated, config, useSpring } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import './styles/global.css'

export interface SheetRefHandle {
  snapTo: (i: number) => void
}

export interface SheetProps {
  isOpen: boolean
  children: ReactElement
}

const height = 5 * 60 + 80
export const Sheet = forwardRef<SheetRefHandle, SheetProps>(function Sheet(
  { isOpen, children }: SheetProps,
  forwardRef: ForwardedRef<SheetRefHandle>,
) {
  const [{ y }, api] = useSpring(() => ({ y: height }))

  const open = ({ canceled }: { [key: string]: any }) => {
    // when cancel is true, it means that the user passed the upwards threshold
    // so we change the spring config to create a nice wobbly effect
    api.start({ y: 0, immediate: false, config: canceled ? config.wobbly : config.stiff })
  }
  const close = (velocity = 0) => {
    api.start({ y: height, immediate: false, config: { ...config.stiff, velocity } })
  }

  const bind = useDrag(
    ({ last, velocity: [, vy], direction: [, dy], offset: [, oy], cancel, canceled }) => {
      // if the user drags up passed a threshold, then we cancel
      // the drag so that the sheet resets to its open position
      if (oy < -70) cancel()

      // when the user releases the sheet, we check whether it passed
      // the threshold for it to close, or if we reset it to its open positino
      if (last) {
        oy > height * 0.5 || (vy > 0.5 && dy > 0) ? close(vy) : open({ canceled })
      }
      // when the user keeps dragging, we just move the sheet according to
      // the cursor position
      else api.start({ y: oy, immediate: true })
    },
    { from: () => [0, y.get()], filterTaps: true, bounds: { top: 0 }, rubberband: true },
  )

  const display = y.to((py) => (py < height ? 'block' : 'none'))

  // const bgStyle = {
  //   transform: y.to([0, height], ['translateY(-8%) scale(1.16)', 'translateY(0px) scale(1.05)']),
  //   opacity: y.to([0, height], [0.4, 1], 'clamp'),
  // }

  useImperativeHandle(forwardRef, () => ({
    snapTo: (i: number) => {
      console.log(i)
    },
  }))

  useEffect(() => {
    if (isOpen) {
      open({ canceled: false })
    } else {
      close()
    }
  }, [isOpen])

  return (
    <animated.div className={styles.sheet} style={{ display, bottom: `calc(-100vh + ${height - 100}px)`, y }}>
      <div className='sheet-header' {...bind()}>
        <span className='sheet-drag-left'></span>
        <span className='sheet-drag-right'></span>
      </div>
      {children}
    </animated.div>
  )
})
