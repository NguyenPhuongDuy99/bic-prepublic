import SectionLayout from "../components/SectionLayout";
import { DEFAULT_CHAINID, EVM_CONTRACT } from "../constants/contractAddress";

export function ChartSection() {
  return (
    <SectionLayout className="w-full aspect-[1/2]">
      <iframe
        height="100%"
        width="100%"
        id="geckoterminal-embed"
        title="GeckoTerminal Embed"
        src={`https://www.geckoterminal.com/${
          DEFAULT_CHAINID == "1301" ? `unichain-sepolia` : `arbitrum`
        }/pools/${
          EVM_CONTRACT[DEFAULT_CHAINID].Pair
        }?embed=1&info=0&swaps=1&grayscale=1&light_chart=0`}
        // frameBorder="0"
        allow="clipboard-write"
        allowFullScreen
      ></iframe>
    </SectionLayout>
  );
}
