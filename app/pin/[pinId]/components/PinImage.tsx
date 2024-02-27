"use client"

import { LuArrowUpRight } from "react-icons/lu"
import Button from "@/components/shared/Button"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function PinImage({ src }: { src: string }) {
  /*
    The displayed width of the image should not exceed 508. If it does, the size of 
      the image should be minified while the aspect-ratio should be remained.
  */
  const [imageSize, setimageSize] = useState({ width: 0, height: 0 })
  const [isBigImage, setIsBigImage] = useState(false)
  const imgContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const newImg = document.createElement("img")
    newImg.src = src
    newImg.onload = (ele: Event) => {
      let { width, height } = ele.target as HTMLImageElement
      const ratio = width / height

      // mobile devices
      if (window.innerWidth < 540) {
        width = window.innerWidth
        height = width / ratio
        height = Math.min(window.innerHeight, height)
        setIsBigImage(true)
      }
      // other devices
      else if (width < 508 || height < 592) {
        width = Math.min(width, 508 - 40) // paddings on 4 sides are 20px
        height = width / ratio
        setIsBigImage(false)
      } else if (width >= 508) {
        width = 508
        height = width / ratio
        setIsBigImage(true)
      }
      setimageSize({ width, height })
    }
  }, [])

  useEffect(() => {
    const imgContainer = imgContainerRef.current
    if (imageSize.width == 0 || !imgContainer) return

    imgContainer.style.width = `${imageSize.width}px`
    imgContainer.style.height = `${imageSize.height}px`
  }, [imageSize])

  return (
    <div className={`flex items-center justify-center box-border max-h-[902px] ${isBigImage ? "" : "p-5"}`}>
      {/* if the width of the image is less than 508 or the height is less than 592,
            the image should float in the center of the container and its border-radius
            should be 16px
        */}
      <div ref={imgContainerRef} className="relative hover-visible-container">
        <Image
          className={`object-cover ${isBigImage ? "" : "rounded-2xl"}`}
          src={src}
          alt="pin image"
          fill
          quality={100}
          priority={true}
          sizes="(max-width: 540px) 100vw, (min-width: 540px) 508px"
        />
        <div className="absolute bottom-4 px-5 flex w-full justify-between">
          <a href={src} target="_blank" className="hover-content-visible">
            <Button bgColor="translucent" hover className="!h-11">
              <div className="flex gap-1 items-center font-medium">
                <LuArrowUpRight className="text-2xl" />
                <span>View image</span>
              </div>
            </Button>
          </a>
          {/* <Button bgColor="translucent" hover rounded className="!h-11">
            <FaSearch />
          </Button> */}
        </div>
      </div>
    </div>
  )
}
