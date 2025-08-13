import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.user.sangathapp",
  appName: "Sangath",
  webDir: "www",
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
};

export default config;
