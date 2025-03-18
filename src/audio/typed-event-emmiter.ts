import { EventEmitter } from "events";

export class TypedEventEmitter<T extends Record<string, any>> {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(500); // fine tune this eventually
  }

  // Type-safe emit method
  emit<K extends keyof T>(eventName: K, data: T[K]): boolean {
    return this.emitter.emit(eventName as string, data);
  }

  // Type-safe on method
  on<K extends keyof T>(eventName: K, listener: (data: T[K]) => void): this {
    this.emitter.on(eventName as string, listener);
    return this;
  }

  // Type-safe once method
  once<K extends keyof T>(eventName: K, listener: (data: T[K]) => void): this {
    this.emitter.once(eventName as string, listener);
    return this;
  }

  // Type-safe off method
  off<K extends keyof T>(eventName: K, listener: (data: T[K]) => void): this {
    this.emitter.off(eventName as string, listener);
    return this;
  }

  // Access to the underlying emitter if needed
  getEmitter(): EventEmitter {
    return this.emitter;
  }
}
