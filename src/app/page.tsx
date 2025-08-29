import { HexMapper } from "@/components/hex-mapper";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <main className="font-body">
      <HexMapper />
      <Toaster />
    </main>
  );
}
