"use client"

import { useSelector } from "react-redux"
import { MdOutlineFileUpload } from "react-icons/md"
import { LuArrowUpRight } from "react-icons/lu"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import { useEffect, useRef } from "react"
import Image from "next/image"
import { calculateCardSize } from "@/lib/utils"

interface Props {
  pinId: string
  image: string
  imageSize: {
    width: number
    height: number
  }
  title: string
  author: {
    name: string
    avatar: string
  }
}
export default function PinCard({ pinId, image, imageSize, title, author }: Props) {
  const screenSize = useSelector((state: any) => state.screenSize.screenSize)
  const cardBody = useRef<HTMLDivElement>(null)
  const cardContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardBody.current && cardContainer.current) {
      const { width, height } = calculateCardSize(imageSize)
      const cardPadding = window.innerWidth >= 820 ? 16 : 8
      cardContainer.current.style.width = width + cardPadding + "px"
      cardBody.current.style.width = width + "px"
      cardBody.current.style.height = height + "px"
    }
  }, [screenSize])

  // continue: fix the error that occurs when open the application with small screen width

  return (
    <div ref={cardContainer} className="absolute p-1 w3:px-2 w3:pb-4">
      <div ref={cardBody} className="relative">
        <Image src={image} alt="pin image" className="rounded-2xl absolute z-[-1]" fill sizes="1000px" />
        <div className="h-full flex flex-col justify-between p-3 cursor-zoom-in hover-show-container max-w3:hidden">
          <div className="flex justify-end hover-content-flex ">
            <Button
              text="Save"
              bgColor="red"
              hover
              clickEffect
              click={() => {
                /* todo */
              }}
            />
          </div>
          <div className="flex justify-between hover-content-flex ">
            <Button
              bgColor="translucent"
              size="small"
              hover
              click={() => {
                /* todo */
              }}>
              <div className="flex items-center gap-2">
                <LuArrowUpRight className="text-black w-4 h-4" />
                <span>space.com</span>
              </div>
            </Button>
            <div className="flex gap-2">
              <Button
                bgColor="translucent"
                size="small"
                rounded
                hover
                clickEffect
                click={() => {
                  /* todo */
                }}>
                <MdOutlineFileUpload className="text-black w-5 h-5" />
              </Button>
              <Button
                bgColor="translucent"
                size="small"
                rounded
                hover
                clickEffect
                click={() => {
                  /* todo */
                }}>
                <TfiMoreAlt className="text-black w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      {screenSize <= 768 && (
        <div className="px-1 mt-1.5">
          <div className="flex items-center justify-between ">
            <h5 className="truncate text-xs font-semibold">{title}</h5>
            <Button
              bgColor="translucent"
              size="tiny"
              rounded
              hover
              clickEffect
              click={() => {
                /* todo */
              }}>
              <TfiMoreAlt className="text-black w-3.5 h-3.5 rotate-90" />
            </Button>
          </div>
          <div className="flex items-center mt-2 gap-1">
            <div className="relative w-8 h-8">
              <Image
                src={author.avatar}
                alt="user avatar"
                className="rounded-full object-cover"
                fill
                sizes="32px"
              />
            </div>
            <div className="flex-1 truncate text-xs font-semibold pr-5">{author.name}</div>
          </div>
        </div>
      )}
    </div>
  )
}
