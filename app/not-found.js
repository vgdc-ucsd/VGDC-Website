import { Button } from "@/components/ui/button"
import Image from 'next/image'


export function ButtonDemo() {
  return <Button>Button</Button>
}

export default function Custom404() {
  
    return (
      <main className="min-h-screen bg-background-black">
          <div className="flex flex-col text-center">

            <Image
              src="/icons/laptop.svg"
              alt="Controller icon"
              width={140}
              height={140}
              className="top-16 w-12 sm:w-20 xl:w-24 sm:top-28 md:top-28"
            />
            <h1
              className="mt-24 inline-block
                bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green bg-clip-text 
                text-center font-inter text-3xl font-extrabold text-transparent
                sm:mt-40 sm:text-5xl md:text-5xl xl:text-7xl"
            >404</h1>

            <h3 className="mt-2 text-center font-inter text-base xl:text-lg text-white">
            Uh oh! We couldnt find the page you were looking for!
            </h3>

            <Button>Home</Button>
          </div>
      </main>
    );
  }