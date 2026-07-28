export function TicketStub({ code }: { code: string }) {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="relative overflow-hidden rounded-md bg-ink text-paper shadow-[0_18px_40px_-18px_rgba(27,36,48,0.55)]">
        <div className="flex items-center justify-between border-b border-dashed border-line-on-ink px-6 py-3">
          <span className="font-display text-[13px] tracking-[0.28em] uppercase text-paper/70">
            Claim Code
          </span>
          <span className="font-display text-[13px] tracking-[0.28em] uppercase text-brass">
            Keep This
          </span>
        </div>

        <div className="relative px-6 py-8 text-center">
          <p className="font-mono text-3xl sm:text-4xl font-medium tracking-[0.14em] text-paper">
            {code}
          </p>
          <p className="mt-3 text-sm text-paper/60">
            Come back anytime and enter this code to see if the board replied.
            No one can connect it to you.
          </p>
        </div>

        {/* perforation notches */}
        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-paper" />
        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-paper" />
      </div>
    </div>
  );
}
