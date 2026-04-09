import type { ReactNode } from "react";
import { CardLogo } from "@/components/CardLogo";

export function QuestionCard({ children }: { children: ReactNode }) {
  return (
    <div className="cah_cards">
      <div className="cah_card_inverted">
        <p>{children}</p>
        <CardLogo variant="question" />
      </div>
    </div>
  );
}
