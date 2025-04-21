import React from "react"
import Image from "next/image"

interface StoreItem {
  name: string
  price: string
  image: string
}

interface StoreVendorProps {
  data: StoreItem[]
}

export default function StoreVendor({ data }: StoreVendorProps) {
  return (
    <div className="mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {data.map((item, index) => (
          <div key={index} className="group overflow-hidden">
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* Fixed height of 16rem (h-64) */}
              <Image
                src={item.image}
                alt={item.name}
                className="object-cover transition group-hover:scale-110"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
              />
            </div>
            <div className="p-2">
              <h2 className="text-md w-fit bg-gradient-to-t from-vgdc-light-blue to-vgdc-light-green bg-clip-text font-semibold text-transparent">
                {item.name}
              </h2>
              <p className="font-bold text-white">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
