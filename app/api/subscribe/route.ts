import { NextRequest, NextResponse } from "next/server";
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY!,
  server: process.env.MAILCHIMP_API_SERVER!
});


export async function POST(
  req: NextRequest,
){

  try {

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: 'Email is required' })
    }
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    if (!audienceId) {
      return NextResponse.json({ message: 'Audience ID is missing' }, { status: 500 });
    }

    const mailChimpData = {
      members: [{
          email_address: email,
          status: 'subscribed'
      }]
    }
     
    // const response = await mailchimp.lists.addListMember(
    //   audienceId,
    //   {email_address: email}
    // )

    // console.log("Response: " + response)
      
    const URL = `https://${process.env.MAILCHIMP_SERVER!}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID!}/members`

    const headers = {
      Authorization: `apiKey ${process.env.MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json'
    }
    const response = await fetch(URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(mailChimpData),
      }
    );

    const data = await response.json()
    console.log('hello')
    if (parseInt(response.status.toString(), 10) >= 400) {
      console.log(response)
      return Response.json({message: response.status }, {status: 401})
    }
     else {
      console.log("Status: " + response.status)
      return Response.json({message: 'Success' }, {status: 200})
    }
  } catch (error: any) {
    if (error.response?.data.title == "Member Exists") {
      return Response.json({message: 'This email already exists'},{ status: 409})
    }
    console.log(error)
    return Response.json({message: error.message }, { status: 500})
  }
}

