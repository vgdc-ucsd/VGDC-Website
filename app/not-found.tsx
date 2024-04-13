import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link';


export function ButtonDemo() {
  return <Button>Button</Button>
}

export default function Custom404() {
  
    return (
      <main className="min-h-screen bg-background-black h-lvh">
            <div className = "h-full flex flex-col justify-center items-center px-4" >
            <Image
              src="/icons/laptop.svg"
              alt="Controller icon"
              width={140}
              height={140}
              className="top-16 w-24 md:top-28 mx-auto"
            />
            <h1
              className="inline-block
                bg-gradient-to-r from-vgdc-light-blue to-vgdc-light-green bg-clip-text 
                text-center font-inter text-3xl font-extrabold text-transparent
                sm:text-5xl md:text-5xl xl:text-7xl"
            >404</h1>

            <h3 className="mt-2 text-center font-inter text-base xl:text-lg text-white">
              Uh oh! We couldnt find the page you were looking for!
            </h3>

            <Link href = "/" className = "mx-auto mt-12">
              <Button>Home</Button>
            </Link>

          </div>

      </main>
    );
  }