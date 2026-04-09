import { Header } from "@/components/Header";
import { Explainer } from "@/components/Explainer";
import { HomeInventorClient } from "@/components/HomeInventorClient";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <Header />
      <div className="grid min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 lg:col-span-4">
          <Explainer />
        </div>
        <HomeInventorClient />
      </div>
    </div>
  );
}
