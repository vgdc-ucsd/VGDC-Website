---
title: "VGDC launches new website"
date: "2024-08-12"
author: "William Kim"
excerpt: "Take a deeper dive into how a team of two devs made our new website using Next.js. "
coverImage: "/cover.png"
---

Hello everyone, I'm Will. **Chase Peterson** and I are pleased to announce that VGDC has finally migrated to Next.js for its new website. This
decision was made with a lot of unknowns when we first started. However, despite our worries, we both felt that the organization
was in dire need of a face lift. Several features were left ignored in the previous website that never saw the light of day.
On top of that, the club was working with a codebase that was becoming unstable to manage.

## Choosing a framework

Deciding on a tech stack that would make dev and user experience easy was crucial. We had scale in mind and we were
sure that future developers would want to add both frontend and backend features later on. After consulting with Chase Peterson,
we chose Next.js to create the new website. This would give us the benefit of SSR (Server Side Rendering) to optimize content
delivery as well as other neat tricks like page routing to make user navigation much more simple than with React.

## Designing and Challenges

Like the rational people we are, we decided to hop on Figma right away to start drafting our ideas. There were core features that we
wanted this time around including a new events and blog system that could deliver information to our users more efficiently than before.
Below you'll see some of the designs that we created in Figma.

Chase worked on implementing the events sytem for us, utilizing the Google Sheets API to automate
the process of having to hardcode a new event every time. By extension this meant he also created our event card components
which you might see occasionally, along with some cool dynamic routing to view event details.

His work extended to the officers page, quite literally the heart and soul of the organization. The mockup itself was straightforward and
Chase managed to cook up some pixel perfect UI that matched our vision. He was also responsible for some of the other details you might overlook such as our style configurations, linting, the navigation bar, the footer, and overall just tidying up all the imperfections that went amiss throughout the
development life cycle.

&nbsp;

![image](/images/blogs/Website-Launch/eventsPage.png)

![image](/images/blogs/Website-Launch/officer.png)
_An officer card prototype with former President Tyler Roache_

&nbsp;

Furthermore, we also had to create a design system that would stand out and give the end product its unique identity.
It was quite obvious that we needed to use the color palette from our original VGDC logo. Still, some new colors would help
bring some contrast to elevate the look and feel. We added a dash of pink, black, and grey to the mix and I think it
gives the website a modern yet fun feel to it.

Eventually, we ran into a few issues that were more technical. First off, how were we going to create a blog system? I heavily considered
creating a separate database to store the info but this would lead to more overhead work and possibly cost money. I was fortunate to
come across a couple of articles online written by other developers who made custom blog systems using markdown. And with a bit of
official info in the Next.js docs, I managed to create a simple pipeline that converts raw markdown into the stylized HTML that you're
reading right now!

![image](/images/blogs/Website-Launch/styleGuide.png)
_Our color guide from Figma_
&nbsp;

![image](/images/blogs/Website-Launch/newsPage.png)

Another issue was the matter of creating a newsletter, which came rather late into development around June. Chase consulted me about
the possibility of adding an email sign-up to fill up some empty space in our footer which you'll see below. We eventually settled on using
[Mailchimp](https://mailchimp.com) to handle our subscriptions.

I thought this would be an easy task but this turned out to be more annoying than I expected. The biggest headache came from the lack
of documentation on the company's API reference. At one point, I actively avoided coding this feature for a week or two before I
hashed it out in a couple hours on a random night.

&nbsp;

![image](/images/blogs/Website-Launch/footer.png)

&nbsp;

## What are some future goals for the dev team?

With that said, there is still a lot of work to be done. We are always looking for ways to improve the website which, believe it or not, at this stage
is just an MVP. Chase and I plan on adding some more artistic elements and other information to all the pages in the next upcoming weeks.
We're especially excited to be updating the home page, which will look 100x better than the current design. So be on the lookout for updates!
We hope you'll enjoy the journey with us, as the club takes just one of many steps to a brighter future at UCSD.

&nbsp;

## Special Thanks

Shoutout to Chase Peterson for helping me with the website. His work was integral to this project and I literally would not have been
able to do this without his skills and commitment.
