import Skeleton, { SkeletonProps } from 'react-loading-skeleton'

import 'react-loading-skeleton/dist/skeleton.css'

import { colors } from '@/lib/styles/colors'

export const StyledSkeleton = (props: SkeletonProps) => {
  return (
    <Skeleton
      baseColor={colors.icGray5}
      highlightColor={colors.icGray1}
      {...props}
    />
  )
}
