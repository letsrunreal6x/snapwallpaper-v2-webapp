
'use client';

import { useEffect } from 'react';
import { App, PluginListenerHandle } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';


export const useBackButton = (callback: () => void) => {
  useEffect(() => {
    let listener: PluginListenerHandle | undefined;

    if (Capacitor.isNativePlatform()) {
      listener = App.addListener('backButton', (event) => {
        if (event.canGoBack) {
          window.history.back();
        } else {
          callback();
        }
      });
    }

    return () => {
        if (listener) {
            listener.remove();
        }
    };
  }, [callback]);
};
