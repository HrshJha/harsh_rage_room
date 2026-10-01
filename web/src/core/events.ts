import type { GameEvent } from '../../../shared/contracts';
type Listener = (event: GameEvent) => void;
const listeners = new Set<Listener>();
export const events = {
  on(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  emit(event: GameEvent) {
    listeners.forEach((fn) => fn(event));
  },
};
