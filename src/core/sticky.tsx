import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { StickyDomRect, StickyProps } from "./types";
import { StickyContext } from "./context";
import './sticky.less';
import classNames from "classnames";

const Sticky = (props: StickyProps) => {
  const { stickyKey, children } = props;
  const { memoizedStickyHeight, updateStickyHeight, useFixed, activeIndex, eventBus } = useContext(StickyContext);
  const ref = useRef<HTMLDivElement>(null);

  const getElementRect = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      // 获取垂直滚动的距离
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      updateStickyHeight(stickyKey, {...rect.toJSON(), scrollTop});
    }
  }

  useEffect(() => {
    getElementRect()

    eventBus?.on('resize', getElementRect)
    return () => {
      updateStickyHeight(stickyKey, null);
      eventBus?.off('resize', getElementRect)
    }
  }, [])

  const { target, isFixed } = useMemo(() => {
    let isFixed = false;
    let target: StickyDomRect | null = null;
    for (let i = memoizedStickyHeight.length - 1; i >= 0; i--) {
      const item = memoizedStickyHeight[i];
      if (activeIndex >= i) {
        isFixed = true;
      }
      if (item.stickyKey === stickyKey) {
        target = item;
        break;
      }
    }
    return { target, isFixed };
  }, [stickyKey, memoizedStickyHeight, activeIndex])


  const placeholderNode = useCallback((options: {
    ref?: React.RefObject<HTMLDivElement>
    useFixed: boolean
    target?: StickyDomRect | null
    isFixed?: boolean
    activeIndex?: number
    isOriginal?: boolean
  }) => {
    const { ref, useFixed, target, isFixed, isOriginal } = options;
    return  (
      <div 
        ref={ref} 
        className={classNames({
          'sticky': !useFixed,
          'sticky-fixed': useFixed && isFixed
        })} 
        style={{ top: target?.offsetTop, width: !isOriginal ? target?.width : undefined }}
      >
        {children}
      </div>
    )
  }, [children])

  return (
    <>
      {placeholderNode({ref, useFixed, target, isOriginal: true})}
       
      {useFixed && isFixed && activeIndex >= 0 && placeholderNode({ useFixed, target, activeIndex, isFixed, isOriginal: false })}
    </>
   
  );
};

Sticky.displayName = 'Sticky';

export default Sticky;
