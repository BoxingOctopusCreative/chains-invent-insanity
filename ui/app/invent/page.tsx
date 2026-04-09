import { Header } from "@/components/Header";
import { InventPageClient } from "@/components/InventPageClient";

export default function InventPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Header />
      <div className="grid min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
        <InventPageClient />
      </div>
    </div>
  );
}
