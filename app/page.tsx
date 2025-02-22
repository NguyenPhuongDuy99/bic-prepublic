import { Providers } from "@/components/Provider";
import { Header } from "./swap/components";
import { Swap } from "./swap/widgets/Swap";

export default function Home() {
  return (
    <Providers>
      <Header />
      <main className="flex-1 min-h-screen">
        <Swap />
      </main>
    </Providers>
  );
}
