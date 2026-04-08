import { Capacitor } from "@capacitor/core";

export const isMobile = () => {
  return Capacitor.isNativePlatform();
};
