import { useContext, useEffect, useMemo, useRef } from "react";
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

  return (
    <>
       <div 
        ref={ref} 
        className={classNames({
          'sticky': !useFixed,
        })} 
        style={{ top: target?.offsetTop }}
      >
        {children}
      </div>
      {
        useFixed && isFixed && (
          <div
            className={classNames({
              'sticky-fixed': useFixed && isFixed,
            })} 
            style={{ top: target?.offsetTop, width: target?.width  }}
          >
            {children}
          </div>
        )
      }
      
    </>
   
  );
};

Sticky.displayName = 'Sticky';

export default Sticky;
