import { useEffect, useMemo, useRef, useState } from "react";
import { StickyContext } from "./context";
import React from "react";
import { ElementNodeType, StickyDomRect, StickyProps } from "./types";
import { useLatest } from "../hooks/useLatest";
import { useDOMSize } from "../hooks/useDomSize";
import { EventBus } from "../utils/event";

interface StickyGroupProps {
  /** 距离顶部距离 */
  offsetTop: number;
  /** 定义顺序, 在每个sticky.Query中定义 */
  // order: string[],
  
  /** 是否使用fixed定位 */
  useFixed?: boolean;
  children: React.ReactNode;
}

const traverseTree = (children: React.ReactNode) => {
  const result: ElementNodeType[] = []
  React.Children.map(children as any, (child: React.FunctionComponentElement<StickyProps>) => {
    if (child?.type?.displayName === 'Sticky') {
      result.push({
        ...child,
        stickyKey: child.props.stickyKey!,
      })
    }
    if (child?.props?.children) {
      result.push(...traverseTree(child.props.children))
    }
  })
  return result
}

export const StickyGroup = (props: StickyGroupProps) => {
  const { offsetTop, children, useFixed = true } = props;
  const stickyGroupRef = useRef<HTMLDivElement>(null);
  const [stickyHeightMap, setStickyHeightMap] = useState<Record<string, DOMRect>>({});
  const nodes = useMemo(() => traverseTree(children), [children]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const eventRef = useRef(new EventBus())

  // const scrollTopRef = useRef(0);
  /** 为了解决，子Sticky
   * 
   * {show && (
      <>
        <Sticky stickyKey='d' >
          <div style={{ background: 'red' }} >b</div>
          <div style={{ background: 'red' }} >d</div>
        </Sticky>
      </>
      )}
   * 
   */
  const [listener] = useDOMSize(() => {
    eventRef.current.emit('resize', stickyGroupRef.current)
  })
  listener(stickyGroupRef.current)
    
  /** 需要计算每一个Sticky的头部距离，然后 */
  const updateStickyHeight = (key: string, rect: DOMRect & { scrollTop: number } | null) => {
    setStickyHeightMap((prev) => {
      if (rect) {
        return {
          ...prev,
          [key]: {
            ...rect,
            top: rect.top + rect.scrollTop,
          },
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = prev;
      return rest;
    })
  }

  const memoizedStickyHeight = useMemo(() => {
    const result: StickyDomRect[] = []
    let sum = offsetTop;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const stickyHeight = stickyHeightMap[node.stickyKey];
      result.push({
        ...stickyHeight,
        stickyKey: node.stickyKey,
        offsetTop: sum,
      })
      sum += stickyHeight?.height || 0;
    }
    return result;
  }, [stickyHeightMap, offsetTop]);

  const handleScroll = useLatest((e: Event) => {
    const scrollTop = e.target instanceof Document
        ? e.target.documentElement.scrollTop || e.target.body.scrollTop
        : document.documentElement.scrollTop

    const finalOffsetTop = scrollTop

    // scrollTopRef.current = finalOffsetTop;

    let index = -1;
    // console.log(memoizedStickyHeight)

    for (let i = memoizedStickyHeight.length - 1; i >= 0; i--) {
      const item = memoizedStickyHeight[i];
      if (finalOffsetTop >= item.top - item.offsetTop) {
        index = i;
        break;
      }
    }

    if (index > -1) {
      setActiveIndex(index)
    }
  })

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [memoizedStickyHeight])

  return (
    <StickyContext.Provider 
      value={{ 
        updateStickyHeight,
        memoizedStickyHeight,
        activeIndex,
        useFixed,
        container: stickyGroupRef.current, 
        eventBus: eventRef.current 
      }}
    >
      <div ref={stickyGroupRef}>
        {children}
      </div>
    </StickyContext.Provider>
  )
};
