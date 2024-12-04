/**
 * 发布订阅
 */
export class EventBus {
  private events: Map<string, Array<(...args: any[]) => void>>;

  constructor() {
    this.events = new Map();
  }

  /**
   * 订阅事件
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  on(eventName: string, callback:  (...args: any[]) => void) {
    const callbacks = this.events.get(eventName) || [];
    callbacks.push(callback);
    this.events.set(eventName, callbacks);
  }

  /**
   * 取消订阅
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  off(eventName: string, callback:  (...args: any[]) => void) {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      this.events.set(
        eventName,
        callbacks.filter(fn => fn !== callback)
      );
    }
  }

  /**
   * 触发事件
   * @param eventName 事件名称
   * @param args 参数列表
   */
  emit(eventName: string, ...args: any[]) {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => {
        callback(...args);
      });
    }
  }

  /**
   * 只订阅一次
   * @param eventName 事件名称
   * @param callback 回调函数
   */
  once(eventName: string, callback:  (...args: any[]) => void) {
    const wrapper = (...args: any[]) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}