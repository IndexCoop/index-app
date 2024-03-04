import Skeleton, { SkeletonProps } from 'react-loading-skeleton'

// This import is needed, otherwise the skeleton won't be visible.
import 'react-loading-skeleton/dist/skeleton.css'

import { colors } from '@/lib/styles/colors'

export const StyledSkeleton = (props: SkeletonProps) => {
  return (
    <Skeleton
      baseColor={'#CFD9D9'}
      highlightColor={colors.ic.gray[100]}
      {...props}
    />
  )
}
