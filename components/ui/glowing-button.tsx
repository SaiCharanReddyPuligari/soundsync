'use client'

import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { cn } from "@/lib/utils"

interface GlowingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export function GlowingButton({ children, className, ...props }: GlowingButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const glowElements = button.querySelectorAll('.GlowingButton__glowWrap span')
    const rect = button.getBoundingClientRect()
    const buttonWidth = button.clientWidth
    const buttonHeight = button.clientHeight

    const normalizeRange = (
      value: number,
      originalMin: number,
      originalMax: number,
      newMin: number,
      newMax: number
    ) => {
      const originalRange = originalMax - originalMin
      const newRange = newMax - newMin
      return ((value - originalMin) * newRange) / originalRange + newMin
    }

    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = normalizeRange(e.clientX - rect.left, 0, buttonWidth, -20, 20)
      const normalizedY = normalizeRange(e.clientY - rect.top, 0, buttonHeight, -7, 7)

      anime({
        targets: glowElements,
        translateX: `${normalizedX}`,
        translateY: `${normalizedY}`
      })
    }

    const handleMouseLeave = () => {
      anime({
        targets: glowElements,
        translateX: 0,
        translateY: 0
      })
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <button
      ref={buttonRef}
      className={cn(
        "relative inline-flex h-10 w-40 items-center justify-center",
        className
      )}
      {...props}
    >
      <div className="GlowingButton__glowWrap l absolute left-[-4px] top-1/2 h-[86.36%] w-[65.93%] -translate-y-1/2">
        <span className="GlowingButton__glow block h-full w-full rounded-[14px] bg-[rgb(213,159,255)] opacity-80 blur-[15px] transition-all duration-600 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] will-change-[transform,filter,opacity]"></span>
      </div>
      <div className="GlowingButton__glowWrap r absolute right-[-4px] top-1/2 h-[86.36%] w-[65.93%] -translate-y-1/2">
        <span className="GlowingButton__glow block h-full w-full rounded-[14px] bg-[rgb(117,215,245)] opacity-80 blur-[15px] transition-all duration-600 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] will-change-[transform,filter,opacity]"></span>
      </div>
      <span className="absolute inset-0 block rounded-[14px] bg-white"></span>
      <div className="relative z-[3] h-fit overflow-hidden text-black">
        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
          {children}
        </span>
        <span className="absolute block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
          {children}
        </span>
      </div>
    </button>
  )
}

