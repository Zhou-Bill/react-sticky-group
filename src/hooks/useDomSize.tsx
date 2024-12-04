import { useCallback, useEffect, useState } from "react"

/**
 * 监听 DOM 的长宽变化
 *
 * ```tsx
 * const [listener, size] = useDOMSize()
 *
 * // 方式 1: 传入一个 DOM
 * listener(document.getElementById('root'))
 *
 * // 方式 2: 使用 ref 绑定
 * <div ref={listener} />
 * ```
 */
export function useDOMSize(cb?: (size: { width: number; height: number }) => void) {
  const [size, setSize] = useState({
    width: undefined as undefined | number,
    height: undefined as undefined | number,
  })

  const [resizeObserver] = useState(() => {
    return new ResizeObserver((entries) => {
      const { blockSize, inlineSize } = entries[0].borderBoxSize[0]
      const height = blockSize
      const width = inlineSize
      cb?.({ height, width })
      setSize((prevState) => {
        if (prevState.height === height && prevState.width === width) {
          return prevState
        }
        return { height, width }
      })
    })
  })

  const listener = useCallback(
    (node: HTMLElement | null) => {
      if (!node) return
      resizeObserver.disconnect()
      resizeObserver.observe(node)
    },
    [resizeObserver],
  )

  useEffect(() => () => resizeObserver.disconnect(), [resizeObserver])

  return [listener, size] as const
}