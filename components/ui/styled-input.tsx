import { cn } from "@/lib/utils"

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function StyledInput({ className, ...props }: StyledInputProps) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-[200px] rounded-[14px] border-none bg-[rgba(83,83,83,0.2)] px-4",
        "text-[rgb(101,101,101)] backdrop-blur-[30px]",
        "transition-all duration-500 placeholder:text-[rgb(101,101,101)]",
        "hover:text-white focus:outline-none focus:ring-0",
        className
      )}
    />
  )
}

