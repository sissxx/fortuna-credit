import { cn } from "@/lib/utils";

export default function FormStepper({
  steps,
  currentStep,
}: {
  steps: string[];
  currentStep: number;
}) {
  return (
    <nav aria-label="Application progress">
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isComplete = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li key={step} className="flex flex-1 flex-col items-center gap-2 text-center">
              <div className="flex w-full items-center">
                <span
                  aria-hidden
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors sm:h-9 sm:w-9",
                    isComplete && "border-brand-gold bg-brand-gold text-brand-black",
                    isCurrent && "border-brand-gold text-brand-gold",
                    !isComplete && !isCurrent && "border-black/15 text-brand-gray/40"
                  )}
                >
                  {isComplete ? (
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </span>
                {index < steps.length - 1 && (
                  <span
                    aria-hidden
                    className={cn("mx-1 h-px flex-1 sm:mx-2", isComplete ? "bg-brand-gold" : "bg-black/10")}
                  />
                )}
              </div>
              <span
                className={cn(
                  "hidden text-[11px] font-medium uppercase tracking-wide sm:block",
                  isCurrent ? "text-brand-black" : "text-brand-gray/50"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
