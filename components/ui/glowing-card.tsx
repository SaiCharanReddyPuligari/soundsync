import { cn } from "@/lib/utils"

interface GlowingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

export function GlowingCard({ children, className, ...props }: GlowingCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-sm",
        "border border-white/10",
        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-[rgb(213,159,255)]/10 before:to-[rgb(117,215,245)]/10",
        "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-[rgb(213,159,255)]/10 after:to-[rgb(117,215,245)]/10 after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}

