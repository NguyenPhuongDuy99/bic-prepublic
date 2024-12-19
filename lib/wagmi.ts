import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { SUPPORTED_CHAINS } from "./chains";

export const config = getDefaultConfig({
  appName: "Web3 demo",
  projectId: "1af1af68064eeb00f30e8602ef5bb51d",
  chains: SUPPORTED_CHAINS,
  ssr: true,
});
