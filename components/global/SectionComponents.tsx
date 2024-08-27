import Link from "next/link"
import { ReactNode, useMemo } from "react"

export function SectionComponent({
  children,
  id,
}: {
  children: ReactNode
  id?: string
}) {
  return (
    <section
      id={id!}
      className="mx-auto my-36 w-full justify-center px-8 sm:w-[36rem] md:w-[44rem] lg:w-[56rem]"
    >
      {children}
    </section>
  )
}

export function SectionHeader({
  heading,
  subheading,
  paragraph,
  href,
  textAlign = "left",
  flip = false,
  target = "_self",
  headingClassName,
  subheadingClassName,
  paragraphClassName,
}: {
  heading: string
  subheading?: string
  paragraph?: string
  href?: string
  textAlign?: "left" | "center" | "right"
  flip?: boolean
  target?: "_blank" | "_parent" | "_self" | "_top"
  headingClassName?: string
  subheadingClassName?: string
  paragraphClassName?: string
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
      {flip || <SectionHeading text={heading} className={headingClassName} />}
      {subheading && (
        <SectionSubheading
          text={subheading}
          href={href}
          target={target}
          className={subheadingClassName}
        />
      )}
      {flip && <SectionHeading text={heading} className={headingClassName} />}
      {paragraph && (
        <SectionParagraph text={paragraph} className={paragraphClassName} />
      )}
    </div>
  )
}

export function SectionHeading({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <h2 className={`text-2xl font-bold text-white md:text-4xl ${className}`}>
      {text}
    </h2>
  )
}

export function SectionSubheading({
  text,
  href,
  target = "_self",
  className,
}: {
  text: string
  href?: string
  target?: "_blank" | "_parent" | "_self" | "_top"
  className?: string
}) {
  const textStyle = "text-sm text-text-grey sm:text-base lg:text-lg"

  if (href) {
    return (
      <Link href={href} target={target} className={`${textStyle} ${className}`}>
        {text}
      </Link>
    )
  } else {
    return <h4 className={`${textStyle} ${className}`}>{text}</h4>
  }
}

export function SectionParagraph({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return <p className={`${className}`}>{text}</p>
}
