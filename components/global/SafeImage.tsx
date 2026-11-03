'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

/**
  * A Next Image component that becomes unoptimized on error to avoid 402s when we exceed Image transformation limits
  */
export default function SafeImage({ src, alt, ...props }: ImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps['src'] | null>(null);
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={props.unoptimized || failedSrc === src}
      onError={(e) => {
        console.warn(`${alt} had to be unoptimized to avoid an error`);
        setFailedSrc(src);
        props.onError?.(e);
      }}
    />
  )
}
