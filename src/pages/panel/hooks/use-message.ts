import { useCallback, useEffect, useRef } from "react";

interface Data {
  type: string;
  payload: any;
}

export const useMessage = (frame: HTMLIFrameElement) => {
  const ref = useRef<HTMLIFrameElement>(frame);
  const typeListeners = useRef<Record<string, any>>({});

  const request = useCallback((data: Data) => {
    return new Promise((resolve, reject) => {
      const destination = ref.current?.contentWindow;
      if (!destination) {
        reject();
        return;
      }
      const _id = Math.random().toString(36).substr(2, 5);
      function onMessage(event: MessageEvent) {
        if (event.data._id !== _id) return;
        window.removeEventListener("message", onMessage);
        resolve(event.data.payload);
      }
      window.addEventListener("message", onMessage);
      destination.postMessage({ ...data, _id }, "*");
    });
  }, []);

  const dispatch = useCallback((data: Data) => {
    const destination = ref.current?.contentWindow;
    if (!destination) return;
    destination.postMessage({ ...data }, "*");
  }, []);

  const listen = useCallback(
    (type: string, listener: (payload: any) => void) => {
      const listeners = typeListeners.current[type] || [];
      listeners.push(listener);

      typeListeners.current[type] = listeners;
      return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
          typeListeners.current[type] = listeners;
        }
      };
    },
    []
  );

  const onWatchEventHandler = useCallback(({ data }: MessageEvent) => {
    if (!data || !data.type) {
      return;
    }

    const { type, payload } = data;
    const listeners = typeListeners.current[type] || [];
    for (let i = 0; i < listeners.length; i++) {
      listeners[i](payload);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", onWatchEventHandler);
    return () => {
      window.removeEventListener("message", onWatchEventHandler);
      typeListeners.current = {};
    };
  }, []);

  return {
    request,
    dispatch,
    listen,
  };
};
