import { ReactNode } from "react"
import Link from "next/link"

export default function PageSection({
  children,
  heading,
  subText,
  id,
  componentStyle,
  backButton
}: {
  children?: ReactNode
  heading?: string
  subText?: ReactNode
  id?: string
  componentStyle?: string
  backButton?: { text: string; href: string }
}) {
  const baseStyle = "mx-auto my-20 px-8 pb-20"
  const sectionClass = componentStyle ? `${baseStyle} ${componentStyle}` : `${baseStyle} max-w-[920px]`
  
  return (
    <section id={id} className={sectionClass}>
      {(heading || subText || backButton) && (
        <div className="mb-4 text-left">
          {backButton && (
            <Link href={backButton.href} className="text-base text-text-grey lg:text-lg hover:text-white transition-colors">
              {backButton.text}
            </Link>
          )}
          {heading && <h2 className="text-4xl font-bold text-white mb-2">{heading}</h2>}
          {subText && <h4 className="text-base text-text-grey lg:text-lg max-w-2xl">{subText}</h4>}
        </div>
      )}
      {children}
    </section>
  )
}
