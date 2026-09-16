import Button from "./ui/Button";

export default function MobileBottomCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-80 flex items-center justify-between gap-4 border-t border-brand-gold/20 bg-brand-black/95 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3 backdrop-blur-md lg:hidden"
      role="complementary"
      aria-label="Apply for a loan"
    >
      <p className="text-sm font-semibold text-white">
        Need a loan?
        <span className="block text-xs font-normal text-brand-muted">Apply in minutes</span>
      </p>
      <Button href="/apply" size="md" variant="primary" className="shrink-0">
        Apply Now →
      </Button>
    </div>
  );
}
