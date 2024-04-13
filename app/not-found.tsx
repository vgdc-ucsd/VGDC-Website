import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function Custom404() {
  return (
    <main className="h-lvh min-h-screen bg-background-black">
      <div className="flex h-full flex-col items-center justify-center px-4">
        <Image
          src="/icons/laptop.svg"
          alt="Controller icon"
          width={140}
          height={140}
          className="top-16 mx-auto w-24 md:top-28"
        />
        <h1
          className="inline-block
                bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green bg-clip-text 
                text-center font-inter text-3xl font-extrabold text-transparent
                sm:text-5xl md:text-5xl xl:text-7xl"
        >
          404
        </h1>

        <h3 className="mt-2 text-center font-inter text-base text-white xl:text-lg">
          Uh oh! We couldnt find the page you were looking for!
        </h3>

        <Link href="/" className="mx-auto mt-12">
          <Button>Home</Button>
        </Link>
      </div>
    </main>
  )
}
