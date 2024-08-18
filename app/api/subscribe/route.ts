import { NextRequest, NextResponse } from "next/server"
import mailchimp from "@mailchimp/mailchimp_marketing"
import axios from "axios"

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_API_SERVER!,
})

export async function POST(req: NextRequest) {
  const URL = `https://${process.env.MAILCHIMP_SERVER!}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID!}/members`

  const options = {
    headers: {
      Authorization: `api_key ${process.env.MAILCHIMP_API_KEY}`,
      "Content-Type": "application/json",
    },
  }

  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ message: "Email is required" })
    }

    const mailChimpData = {
      email_address: email,
      status: "subscribed",
    }
    const response = await axios.post(
      URL,
      JSON.stringify(mailChimpData),
      options
    )

    //console.log(response)

    if (response.status == 200) {
      return Response.json(
        { message: "You have successfully subscribed!" },
        { status: 200 }
      )
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error(
          "Axios Error",
          `${error.response.status}`,
          `${error.response.data.title}`,
          `${error.response.data.detail}`
        )
        if (error.response.data.title == "Member Exists") {
          return Response.json(
            { message: "This email is already subscribed." },
            { status: 400 }
          )
        }
        if (error.response.data.title == "Invalid Resource") {
          return Response.json(
            { message: "This email appears fake or invalid." },
            { status: 400 }
          )
        }
      } else if (error.request) {
        console.error(error.request)
      } else {
        console.error("Error", error.message)
      }
    }
  }

  return Response.json(
    { message: "An error occurred signing up your email." },
    { status: 500 }
  )
}
