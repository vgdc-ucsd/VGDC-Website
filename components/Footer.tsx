import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { SiMinutemailer } from 'react-icons/si'
import { FaInstagram, FaDiscord, FaFacebook } from 'react-icons/fa'

export default function Footer() {
  const accordionStyle = 'mb-4'
  const socialLinkStyle =
    'text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink'

  return (
    <div className="bg-footer-grey">
      <div className="mx-auto flex w-full max-w-full flex-col justify-center pt-8 sm:w-fit lg:flex-row-reverse lg:space-x-4">
        <div className="min-w-full p-8 sm:w-[540px] sm:min-w-0">
          <h4 className="text-text-white text-lg">Stay connected!</h4>
          <span className="align-center mt-4 flex w-48 flex-row justify-between">
            <a href="https://www.instagram.com/vgdc.ucsd/" target="_blank">
              <FaInstagram className={socialLinkStyle} size={32} />
            </a>
            <a href="https://bit.ly/VGDCUCSD" target="_blank">
              <FaDiscord className={socialLinkStyle} size={32} />
            </a>
            <a
              href="https://www.facebook.com/groups/VGDC.UCSD/"
              target="_blank"
            >
              <FaFacebook className={socialLinkStyle} size={28} />
            </a>
            <a href="mailto:vgdc@ucsd.edu" target="_blank">
              <SiMinutemailer className={socialLinkStyle} size={28} />
            </a>
          </span>
          <div className="mt-10 h-28 rounded-md bg-[#232528]"></div>
        </div>
        <div className="min-w-full p-8 sm:w-[540px] sm:min-w-0">
          <h3 className="text-text-white mb-4 text-2xl font-semibold lg:text-4xl">
            FAQs
          </h3>
          <div className="text-sm text-white">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className={accordionStyle}>
                <AccordionTrigger className="text-left">
                  How do I get involved?
                </AccordionTrigger>
                <AccordionContent>{"You don't."}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className={accordionStyle}>
                <AccordionTrigger className="text-left">
                  Can I join the board?
                </AccordionTrigger>
                <AccordionContent>No.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className={accordionStyle}>
                <AccordionTrigger className="text-left">
                  Where can I find resources to creative tools?
                </AccordionTrigger>
                <AccordionContent>Google them.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className={accordionStyle}>
                <AccordionTrigger className="text-left">
                  {"What if I haven't made games before?"}
                </AccordionTrigger>
                <AccordionContent>Then leave.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className={accordionStyle}>
                <AccordionTrigger className="text-left">
                  Do I need to be a programmer?
                </AccordionTrigger>
                <AccordionContent>Yes.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="py-8 text-center font-medium text-text-grey">
        Video Game Development Club
      </div>
    </div>
  )
}
