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
        <Tabs defaultValue="swap" className="">
          <TabsList className="grid w-full grid-cols-2 max-w-[143px] mx-auto">
            <TabsTrigger value="swap">Swap</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
          </TabsList>
          <TabsContent value="swap">
            <Swap />
          </TabsContent>
          <TabsContent value="stake">
            <Stake />
          </TabsContent>
        </Tabs>
      </main>
    </Providers>
  );
}
