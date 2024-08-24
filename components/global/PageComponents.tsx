import Link from "next/link"
import { ReactNode, useMemo } from "react"

export function PageComponent({
  children,
  id,
}: {
  children: ReactNode
  id?: string
}) {
  return (
    <section id={id!} className="mx-auto my-20 max-w-[920px] px-8 pb-20">
      {children}
    </section>
  )
}

export function PageHeader({
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
      {flip || <PageHeading text={heading} className={headingClassName} />}
      {subheading && (
        <PageSubheading
          text={subheading}
          href={href}
          target={target}
          className={subheadingClassName}
        />
      )}
      {flip && <PageHeading text={heading} className={headingClassName} />}
      {paragraph && (
        <PageParagraph text={paragraph} className={paragraphClassName} />
      )}
    </div>
  )
}

export function PageHeading({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <h2 className={`text-4xl font-bold text-white ${className}`}>{text}</h2>
  )
}

export function PageSubheading({
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
  const textStyle = "text-base text-text-grey lg:text-lg"

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

export function PageParagraph({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <p
      className={`mt-2 max-w-[600px] text-lg leading-6 text-text-white ${className}`}
    >
      {text}
    </p>
  )
}
