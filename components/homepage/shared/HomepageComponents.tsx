import Link from "next/link"
import { useMemo } from "react"

export function SectionHeader({
  heading,
  subheading,
  href,
  textAlign,
}: {
  heading: string
  subheading?: string
  href?: string
  textAlign?: "left" | "center" | "right"
}) {
  const alignStyle = useMemo(() => {
    switch (textAlign) {
      case "center":
        return "text-center"
      case "right":
        return "text-right"
      case "left":
      default:
        return "text-left"
    }
  }, [textAlign])

  return (
    <div className={`mb-4 ${alignStyle}`}>
      <SectionHeading text={heading} />
      {subheading && <SectionSubheading text={subheading} href={href} />}
    </div>
  )
}

export function SectionHeading({ text }: { text: string }) {
  return <h2 className="text-2xl font-bold text-white lg:text-4xl">{text}</h2>
}

export function SectionSubheading({
  text,
  href,
}: {
  text: string
  href?: string
}) {
  const textStyle = "text-sm text-text-grey sm:text-base lg:text-lg"

  if (href) {
    return (
      <Link href={href} target="_blank" className={textStyle}>
        {text}
      </Link>
    )
  } else {
    return <h4 className={textStyle}>{text}</h4>
  }
}
