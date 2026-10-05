"use client"

import Navbar from "@/components/global/Navbar"
import Footer from "@/components/global/Footer"
import PageSection from "@/components/global/PageSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventForm from "@/components/dashboard/forms/EventForm"
import GameForm from "@/components/dashboard/forms/GameForm"
import BlogPostForm from "@/components/dashboard/forms/BlogPostForm"

export default function DashboardClient({ userName }: { userName: string }) {
  return (
    <main className="min-h-screen bg-background-black">
      <Navbar />
      <PageSection>
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-2">Officer Dashboard</h2>
          <h4 className="text-base text-text-grey lg:text-lg">Manage website content below.</h4>
        </div>
        <Tabs defaultValue="event">
          <div className="flex justify-center">
            <TabsList className="mb-6 bg-background-grey  p-1 h-auto">
              <TabsTrigger
                value="event"
                className="text-text-grey data-[state=active]:text-vgdc-light-green data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-vgdc-light-green rounded-none px-5 py-2 text-sm font-light transition-colors"
              >
                Add Event
              </TabsTrigger>
              <TabsTrigger
                value="game"
                className="text-text-grey data-[state=active]:text-vgdc-light-green data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-vgdc-light-green rounded-none px-5 py-2 text-sm font-light transition-colors"
              >
                Add Game
              </TabsTrigger>
              <TabsTrigger
                value="blog"
                className="text-text-grey data-[state=active]:text-vgdc-light-green data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-vgdc-light-green rounded-none px-5 py-2 text-sm font-light transition-colors"
              >
                Write Blog Post
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="event">
            <EventForm />
          </TabsContent>
          <TabsContent value="game">
            <GameForm />
          </TabsContent>
          <TabsContent value="blog">
            <BlogPostForm />
          </TabsContent>
        </Tabs>
      </PageSection>
      <Footer />
    </main>
  )
}
