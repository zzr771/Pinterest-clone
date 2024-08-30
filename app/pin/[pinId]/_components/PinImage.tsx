"use client"

import { LuArrowUpRight } from "react-icons/lu"
import Button from "@/components/shared/Button"
import Image from "next/image"
import { useLayoutEffect, useState } from "react"

interface Props {
  imageUrl: string
  width: number
  height: number
}
export default function PinImage({ imageUrl, width, height }: Props) {
  /*
    The displayed width of the image should not exceed 508. If it does, the size of 
      the image should be minified while the aspect-ratio remains the same.
  */

  const [isBigImage, setIsBigImage] = useState(true)
  const [displaySize, setDisplaySize] = useState({ width, height })
  useLayoutEffect(() => {
    const ratio = width / height
    const size = { width: 0, height: 0 }
    // mobile devices
    if (window.innerWidth < 820) {
      size.width = window.innerWidth
      size.height = Math.min(window.innerHeight, size.width / ratio)
      setIsBigImage(true)
    }
    // other devices
    else if (width < 508 || height < 592) {
      size.width = Math.min(width, 508 - 40) // paddings on 4 sides are 20px
      size.height = size.width / ratio
      setIsBigImage(false)
    } else if (width >= 508) {
      size.width = 508
      size.height = size.width / ratio
      setIsBigImage(true)
    }
    setDisplaySize(size)
  }, [width, height])

  return (
    <div
      className={`pinImage flex items-center justify-center box-border pin-image-width max-h-screen w5:min-h-[592px] w5:max-h-[902px] overflow-hidden w3:max-w5:rounded-t-[2rem] w5:rounded-l-[2rem] ${
        isBigImage ? "" : "p-5"
      }`}>
      {/*
          if the width of the image is less than 508 or the height is less than 592,
        the image should float in the center of the container and its border-radius
        should be 16px
      */}
      <div className="relative hover-visible-container w5:max-h-[902px] overflow-hidden">
        <Image
          className={`object-cover ${isBigImage ? "" : "rounded-2xl"} bg-gray-bg-4`}
          src={imageUrl}
          alt="pin image"
          width={displaySize.width}
          height={displaySize.height}
          quality={100}
          priority={true}
          sizes="(max-width: 820px) 100vw, (min-width: 820px) 508px"
        />
        <div className="absolute bottom-4 px-5 flex w-full justify-between">
          <a href={imageUrl} target="_blank" className="hover-content-visible">
            <Button bgColor="translucent" hover className="!h-11">
              <div className="flex gap-1 items-center font-medium">
                <LuArrowUpRight className="text-2xl" />
                <span>View image</span>
              </div>
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
