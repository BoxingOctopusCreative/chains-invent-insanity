import type { ReactNode } from "react";
import { CardLogo } from "@/components/CardLogo";

export function AnswerCard({ children }: { children: ReactNode }) {
  return (
    <div className="cah_cards">
      <div className="cah_card">
        <p>{children}</p>
        <CardLogo variant="answer" />
      </div>
    </div>
  );
}
