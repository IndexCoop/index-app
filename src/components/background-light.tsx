'use client'

import { motion } from 'framer-motion'
import { FC } from 'react'

import { cn } from '@/lib/utils/tailwind'

export const BackgroundLight: FC<{
  background: string
  className?: string
}> = ({ background, className }) => {
  return (
    <div className={cn('absolute h-[600px] w-[600px]', className)}>
      <motion.div
        className={'h-full w-full rounded-full opacity-30'}
        style={{
          background,
          filter: 'blur(60px)',
          mixBlendMode: 'difference',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

export default BackgroundLight
