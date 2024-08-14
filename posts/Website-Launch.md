---
title: 'VGDC launches new website'
date: '2024-08-12'
author: 'William Kim'
excerpt: 'Take a deeper dive into how a team of two devs made our new website using Next JS. '
coverImage: '/cover.png'
---


Hello everyone, I'm Will. I'm pleased to announce that VGDC has finally migrated to Next JS for its new website. This
decision came quite late into my role as website manager in 2024. However despite the timing, I felt that the organization
was in dire need of a face lift. Several features were left ignored in the previous website that never saw the light of day.
On top of that, I was working with a codebase that was becoming unstable to manage. 

## Choosing a framework 
Deciding on a tech stack that would make dev and user experience easy was crucial. Furthermore, we had scale in mind and we were
sure that future developers would want to add both frontend and backend features later on. After consulting with my friend 
and executive officer **Chase Peterson**, we chose Next JS to create the new website. 

## Designing and Challenges
Like the rational people we were, we decided to hop on Figma right away to start drafting our ideas. There were core features that we 
wanted this time around including a new events and blog system that could deliver information to our users more efficiently than before. 
Below you'll see some of the designs that we created in Figma. 

&nbsp;

![image](/images/blogs/Website-Launch/newsPage.png)

![image](/images/blogs/Website-Launch/eventsPage.png)

&nbsp;

Still we ran into a few issues that were more technical. First off, how were we going to create a blog system? I heavily considered 
creating a separate database to store the info but this would lead to more overhead work and possibly cost money. I was fortunate to 
come across a couple of articles online written by other developers who made custom blog systems using markdown. And with a bit of 
official info on the Next JS docs, I managed to create a simple pipeline that converts raw markdown into the stylized html that you're 
reading right now!

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
Our work never stops evolving. We are always looking for ways to improve the website which, believe it or not, at this stage 
is just an MVP. We plan on adding some more artistic elements and other information to all the pages in the next upcoming weeks. 
Be on the lookout for updates! We hope you'll enjoy the journey with us, as the club takes just one of many steps to a brighter future at UCSD.

&nbsp;

## Special Thanks
Also shoutout to Chase Peterson for helping me with the website. 
