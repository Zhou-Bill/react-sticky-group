export type ElementNodeType = React.ReactNode & {
  stickyKey: string;
}

export interface StickyProps {
  className?: string;
  style?: React.CSSProperties;
  /** 在StickyGroup中定义的order 相对应的key */
  stickyKey: string;
  children: React.ReactNode;
}

export type StickyDomRect = {
  offsetTop: number;
  stickyKey: string;
  height: number;
  top: number;
  width: number;
}
