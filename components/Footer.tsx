"use client"
import { z } from "zod"
import axios, { Axios } from "axios"
import { useForm, FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { SiMinutemailer } from "react-icons/si"
import { FaInstagram, FaDiscord, FaFacebook } from "react-icons/fa"

// Questions and answers to fill the accordion with
const questions = [
  {
    question: "How do I get involved?",
    answer: "You don't.",
  },
  {
    question: "Can I join the board?",
    answer: "No.",
  },
  {
    question: "Where can I find resources to creative tools?",
    answer: "Google.",
  },
  {
    question: "What if I haven't made games before?",
    answer: "Then leave.",
  },
  {
    question: "Do I need to be a programmer?",
    answer: "Yes.",
  },
]

const formSchema = z.object({
  email: z.string().email({
    message: "Please provide a valid email",
  }),
})

/**
 * The footer that appears at the bottom of every page.
 *
 * @returns JSX representation of the hero.
 */
export default function Footer() {
  return (
    <div className="bg-footer-grey">
      {/* Responsive flexbox containing the FAQs, social links, and extra box. */}
      <div className="mx-auto mt-[4rem] flex w-full max-w-full flex-col justify-center pt-8 sm:w-fit md:mt-[8rem] lg:flex-row-reverse lg:space-x-4">
        {/* Social links */}
        <div className="min-w-full p-8 sm:w-[540px] sm:min-w-0">
          <SocialLinks />

          {/* Special box that does nothing (yet) */}
          <Newsletter />
        </div>
        {/* FAQs */}
        <div className="min-w-full p-8 sm:w-[540px] sm:min-w-0">
          <FAQs />
        </div>
      </div>
      <div className="py-8 text-center font-medium text-text-grey">
        Video Game Development Club
        <br className="visible sm:hidden" />
        {" © "}
        {new Date().getFullYear()}
      </div>
    </div>
  )
}

/**
 * The social links in the footer.
 *
 * @returns The JSX of the social links.
 */
function SocialLinks() {
  // Style for the social links
  const socialLinkStyle =
    "text-white transition ease-in duration-150 hover:cursor-pointer hover:text-hot-pink"

  return (
    <>
      <h4 className="text-center text-lg text-text-white lg:text-left">
        Stay connected!
      </h4>
      <span className="align-center mx-auto mt-4 flex w-48 flex-row justify-between lg:mx-0">
        <a href="https://www.instagram.com/vgdc.ucsd/" target="_blank">
          <FaInstagram className={socialLinkStyle} size={32} />
        </a>
        <a href="https://bit.ly/VGDCUCSD" target="_blank">
          <FaDiscord className={socialLinkStyle} size={32} />
        </a>
        <a href="https://www.facebook.com/groups/VGDC.UCSD/" target="_blank">
          <FaFacebook className={socialLinkStyle} size={28} />
        </a>
        <a href="mailto:vgdc@ucsd.edu" target="_blank">
          <SiMinutemailer className={socialLinkStyle} size={28} />
        </a>
      </span>
    </>
  )
}

/**
 * The FAQs in the footer.
 *
 * @returns The JSX of the FAQs.
 */
function FAQs() {
  return (
    <>
      {/* Header */}
      <h3 className="mb-4 text-2xl font-semibold text-text-white lg:text-4xl">
        FAQs
      </h3>
      {/* List of questions */}
      <div className="text-sm text-white">
        <Accordion type="single" collapsible>
          {/* Map each question to an accordion item */}
          {questions.map((faq, index) => {
            return (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="mb-4"
              >
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </>
  )
}

function Newsletter() {
  const { toast } = useToast()

  // Define the form instance
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      })

      const data = await response.json()

      if (response.status == 200) {
        toast({
          title: "Successfully signed up!",
          description: "Make sure to check your email inbox.",
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        })
      } else {
        toast({
          title: "Something went wrong",
          description: `${data.message}`,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        })
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  return (
    <div className="mt-10 box-border rounded-lg bg-background-grey/50 p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-lg text-white">
                  Join our newsletter!
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="max-w-full border-none bg-footer-grey text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-background-grey"
            onSubmit={() => {
              onSubmit
            }}
          >
            Subscribe
          </Button>
        </form>
      </Form>
    </div>
  )
}
