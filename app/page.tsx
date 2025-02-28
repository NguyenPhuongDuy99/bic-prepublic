import { Providers } from "@/components/Provider";
import { Header } from "./swap/components";
import { Swap } from "./swap/widgets/Swap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Stake from "./stake/widgets/Stake";

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
