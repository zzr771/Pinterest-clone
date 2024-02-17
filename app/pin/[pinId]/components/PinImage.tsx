"use client"

import { LuArrowUpRight } from "react-icons/lu"
import { FaSearch } from "react-icons/fa"
import Button from "@/components/shared/Button"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function PinImage({ src }: { src: string }) {
  /*
    The displayed width of the image should not exceed 508. If it does, the size of 
      the image should be minified while the aspect-ratio should be remained.
  */
  const [imageSizes, setImageSizes] = useState<number[]>([0, 0]) // [width, height]
  const [isBigImage, setIsBigImage] = useState(false)

  useEffect(() => {
    const newImg = document.createElement("img")
    newImg.src = src
    newImg.onload = (ele: Event) => {
      let { width, height } = ele.target as HTMLImageElement
      const ratio = width / height

      if (width < 508 || height < 592) {
        // paddings on 4 sides are 20px
        width = Math.min(width, 508 - 40)
        height = width / ratio
        setIsBigImage(false)
      } else if (width >= 508) {
        width = 508
        height = width / ratio
        setIsBigImage(true)
      }
      setImageSizes([width, height])
    }
  }, [])

  return (
    <div className={`flex items-center justify-center box-border max-h-[902px] ${isBigImage ? "" : "p-5"}`}>
      {/* if the width of the image is less than 508 or the height is less than 592,
            the image should float in the center of the container and its border-radius
            should be 16px
        */}
      <div className="relative hover-visible-container">
        <Image
          className={`${isBigImage ? "" : "rounded-2xl"}`}
          src={src}
          alt=""
          width={imageSizes[0]}
          height={imageSizes[1]}
        />
        <div className="absolute bottom-4 px-5 flex w-full justify-between">
          <a href={src} target="_blank" className="hover-content-visible">
            <Button bgColor="translucent" hover className="!h-11">
              <div className="flex gap-1 items-center font-semibold">
                <LuArrowUpRight className="text-2xl" />
                <span>View image</span>
              </div>
            </Button>
          </a>
          <Button bgColor="translucent" hover rounded className="!h-11">
            <FaSearch />
          </Button>
        </div>
      </div>
    </div>
  )
}
