import { useMemo, useRef } from "react"

type Fn<T extends any[], R> = (...args: T) => R

export const useLatest = <T extends any[], R>(fn: Fn<T, R>): Fn<T, R> => {
  const ref = useRef(fn)
  ref.current = fn
  return useMemo(
    () =>
      (...args: any) => {
        const { current } = ref
        return current(...args)
      },
    [],
  )
}