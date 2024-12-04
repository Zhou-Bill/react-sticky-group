import { createContext } from "react";
import { StickyDomRect } from "./types";
import { EventBus } from "../utils/event";

export interface StickyContextType {
  /** 计算好的Sticky的高度 */
  memoizedStickyHeight: StickyDomRect[]
  /** 更新Sticky的高度 */
  updateStickyHeight: (key: string, rect: DOMRect & { scrollTop: number } | null) => void
  /** 当前激活的Sticky的index */
  activeIndex: number
  /** 是否使用fixed定位 */
  useFixed: boolean
  /** 容器 */
  container: HTMLElement | null
  /** 事件总线 */
  eventBus: EventBus | null
}

export const StickyContext = createContext<StickyContextType>({
  memoizedStickyHeight: [],
  updateStickyHeight: () => {},
  activeIndex: -1,
  useFixed: false,
  container: null,
  eventBus: null
});

