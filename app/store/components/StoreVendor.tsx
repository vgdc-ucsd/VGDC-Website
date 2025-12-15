'use client'

import React from "react"
import Image from "next/image"
import Link from "next/link"

import { StoreItemDetails } from "@/lib/store_items"

interface StoreVendorProps {
  data: StoreItemDetails[]
}

export default function StoreVendor({ data }: StoreVendorProps) {
  return (
    <div className="mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-3">
        {data.map((item, index) => (
          <div key={index} className="group overflow-hidden">
            <Link href={item.stock ? "https://docs.google.com/forms/d/e/1FAIpQLSe6t-887BQ3EJnKMSihdEvyexDBpEX6ngOeY787Z0RHgafK4g/viewform" : "#"} onClick={(e) => {
              if (!item.stock) {
                e.preventDefault();
              }
            }}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
              {/* Fixed height of 16rem (h-64) */}
              <Image
                src={item.image}
                alt={item.name}
                className={`object-cover transition group-hover:scale-110 ${
                  item.stock === false ? 'brightness-50 grayscale' : ''
                }`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 3}
              />
            </div>
            <div className="p-2">
              <h2 className="text-md w-fit bg-gradient-to-t from-vgdc-light-blue to-vgdc-light-green bg-clip-text font-semibold text-transparent">
                {item.name}
              </h2>
              {item.stock ? (
                <p className="font-bold text-white">{item.price}</p>
              ) : (
                <p className="font-bold text-red-600">OUT OF STOCK</p>
              )}
            </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
