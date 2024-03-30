import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LuArrowUpRight } from "react-icons/lu"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import { useAppSelector } from "@/lib/store/hook"
import { getRandomColorHex } from "@/lib/utils"
import dynamic from "next/dynamic"
import Link from "next/link"
import OptionListMobile from "../mobile/OptionListMobile"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

interface Props {
  pinId: string
  src: string
  imageSize: {
    width: number
    height: number
  }
  title: string
  author: {
    name: string
    avatar: string
    id: string
  }
}
export default function PinCard({ pinId, src, imageSize, title, author }: Props) {
  const router = useRouter()
  const screenSize = useAppSelector((state: any) => state.screenSize.screenSize)
  const cardBody = useRef<HTMLDivElement>(null)
  const cardContainer = useRef<HTMLDivElement>(null)
  const [imageDisplaySize, setImageDisplaySize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (cardBody.current) {
      const { width, height } = imageSize
      const displaySize = { width: 0, height: 0 }

      if (window.innerWidth >= 820) {
        displaySize.width = width
      } else {
        let cardWidth
        if (window.innerWidth >= 540 && window.innerWidth < 820) {
          cardWidth = Math.round((window.innerWidth - 16) * 0.3333) // 16: waterfall container's left and right padding
        } else {
          cardWidth = Math.round((window.innerWidth - 16) * 0.5) // 16: waterfall container's left and right padding
        }
        displaySize.width = cardWidth - 8 // 8: PinCard's left and right padding
      }

      displaySize.height = (height / width) * displaySize.width
      setImageDisplaySize(displaySize)
      cardBody.current.style.backgroundColor = getRandomColorHex()
    }

    setTimeout(() => {
      cardContainer.current?.classList.add("card-transform")
    }, 1000)
  }, [screenSize])

  const options = useRef([
    {
      label: "Hide Pin",
      callback: () => {},
    },
    {
      label: "Download image",
      callback: () => {},
    },
  ])
  const mobileOptions = useRef([
    {
      label: "Save",
      callback: () => {},
    },
    {
      label: "Hide Pin",
      callback: () => {},
    },
    {
      label: "Download image",
      callback: () => {},
    },
  ])

  return (
    <div ref={cardContainer} className="absolute p-1 pb-2 w3:px-2 w3:pb-4 w3:pt-0">
      <div ref={cardBody} className="relative rounded-2xl" onClick={() => router.push(`/pin/${pinId}`)}>
        <Image
          src={src}
          alt="pin cover image"
          className="rounded-2xl"
          width={imageDisplaySize.width}
          height={imageDisplaySize.height}
          quality={100}
        />

        {/* buttons on image */}
        <div
          className="absolute inset-0 h-full flex flex-col justify-between p-3 rounded-2xl cursor-pointer max-w3:hidden hover:bg-gray-tp-1 hover-show-container"
          onClick={() => router.push(`/pin/${pinId}`)}>
          <div className="flex justify-end hover-content-flex">
            <Button
              text="Save"
              bgColor="red"
              hover
              clickEffect
              click={(event) => {
                event.stopPropagation()
                // todo
              }}
            />
          </div>
          <div className="flex justify-between hover-content-flex">
            <Button
              bgColor="translucent"
              size="small"
              hover
              click={(event) => {
                event.stopPropagation()
                /* todo */
              }}>
              <div className="flex items-center gap-2">
                <LuArrowUpRight className="text-black w-4 h-4" />
                <span>space.com</span>
              </div>
            </Button>

            <DropDownList options={options.current} position={{ offsetY: 40 }}>
              <Button bgColor="translucent" size="small" rounded hover clickEffect>
                <TfiMoreAlt className="text-black w-4 h-4" />
              </Button>
            </DropDownList>
          </div>
        </div>
      </div>

      {/* title & author */}
      <div className="px-1 mt-1.5 bg-white">
        <div className="flex items-center justify-between ">
          <Link href={`/pin/${pinId}`}>
            <h5 className="truncate max-w3:text-xs text-sm font-medium cursor-pointer">{title}</h5>
          </Link>

          {screenSize < 820 && (
            <OptionListMobile options={mobileOptions.current}>
              <Button bgColor="translucent" size="tiny" rounded hover clickEffect>
                <TfiMoreAlt className="text-black w-3.5 h-3.5 rotate-90" />
              </Button>
            </OptionListMobile>
          )}
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
          <Link href={`/user/${author.id}`}>
            <div className="flex-1 truncate max-w3:text-xs text-sm font-normal pr-5 hover:underline cursor-pointer">
              {author.name}
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
