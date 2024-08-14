import { useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LuArrowUpRight } from "react-icons/lu"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import { useAppSelector } from "@/lib/store/hook"
import { getRandomColorHex, handleDownloadImage, shortenURL } from "@/lib/utils"
import dynamic from "next/dynamic"
import Link from "next/link"
import OptionListMobile from "../mobile/OptionListMobile"
import useSavePin from "@/lib/hooks/useSavePin"
const DropDownList = dynamic(() => import("@/components/shared/DropDownList"), { ssr: false })

interface PinCard {
  _id: string
  author: {
    _id: string
    firstName: string
    lastName: string
    imageUrl: string
  }
  imageUrl: string
  imageSize: {
    width: number
    height: number
  }
  title: string
  link: string
}
interface Props {
  pin: PinCard
  isSaved: boolean
}
export default function PinCard({ pin, isSaved }: Props) {
  const router = useRouter()
  const screenSize = useAppSelector((store) => store.screenSize.screenSize)
  const cardBody = useRef<HTMLDivElement>(null)
  const cardContainer = useRef<HTMLDivElement>(null)

  const { _id, author, imageUrl, imageSize, title, link } = pin
  const shortLink = shortenURL(link)

  const { savePin, unsavePin } = useSavePin()

  const options = [
    {
      label: "Download image",
      callback: () => {
        handleDownloadImage(imageUrl, title)
      },
    },
  ]
  const mobileOptions = [
    {
      label: isSaved ? "Unsave" : "Save",
      callback: () => {
        isSaved ? unsavePin(_id) : savePin(_id)
      },
    },
    {
      label: "Download image",
      callback: () => {
        handleDownloadImage(imageUrl, title)
      },
    },
  ]

  useEffect(() => {
    if (cardBody.current) {
      cardBody.current.style.backgroundColor = getRandomColorHex()
    }

    setTimeout(() => {
      cardContainer.current?.classList.add("card-transform")
    }, 1000)
  }, [])

  return (
    <div
      ref={cardContainer}
      className="absolute m-1 mb-2 w3:mx-2 w3:mb-4 w3:mt-0"
      style={{ width: imageSize.width }}>
      <div ref={cardBody} className="relative rounded-2xl" onClick={() => router.push(`/pin/${_id}`)}>
        <Image
          src={imageUrl}
          alt=""
          className="rounded-2xl"
          width={imageSize.width}
          height={imageSize.height}
        />

        {/* buttons on image */}
        <div
          className="absolute inset-0 h-full flex flex-col justify-between p-3 rounded-2xl cursor-pointer max-w3:hidden hover:bg-gray-tp-1 hover-show-container"
          onClick={() => router.push(`/pin/${_id}`)}>
          <div className="flex justify-end hover-content-flex">
            <Button
              text={isSaved ? "Saved" : "Save"}
              bgColor={isSaved ? "black" : "red"}
              hover
              clickEffect
              click={(event) => {
                event.stopPropagation()
                isSaved ? unsavePin(_id) : savePin(_id)
              }}
            />
          </div>
          <div className="flex justify-between hover-content-flex">
            {link ? (
              <Button
                bgColor="translucent"
                size="small"
                hover
                click={(event) => {
                  event.stopPropagation()
                  window.open(link, "_blank")
                }}>
                <div className="flex items-center gap-2">
                  <LuArrowUpRight className="text-black w-4 h-4" />
                  <span className="max-w-28 truncate ">{shortLink}</span>
                </div>
              </Button>
            ) : (
              <div></div>
            )}

            <DropDownList options={options} position={{ offsetY: 40 }}>
              <Button bgColor="translucent" size="small" rounded hover clickEffect>
                <TfiMoreAlt className="text-black w-4 h-4" />
              </Button>
            </DropDownList>
          </div>
        </div>
      </div>

      {/* title & author */}
      <div className="flex px-1 bg-white">
        <div className="flex-1 max-w-[100%] max-w3:max-w-[calc(100%-32px)]">
          <div className="flex items-center justify-between">
            {title && (
              <Link href={`/pin/${_id}`} className="w-full mt-1.5">
                <h5 className="truncate max-w3:text-xs text-sm font-medium cursor-pointer">{title}</h5>
              </Link>
            )}
          </div>
          <Link
            href={`/user/${author._id}`}
            className="flex items-center mt-1 w3:mt-2 gap-1 hover:underline cursor-pointer">
            <Image
              src={author.imageUrl}
              alt="user avatar"
              className="rounded-full object-cover h-8 w-8"
              width={32}
              height={32}
            />
            <div className="flex-1 truncate max-w3:text-xs text-sm font-normal pr-5 ">
              {author.firstName + " " + author.lastName}
            </div>
          </Link>
        </div>
        {screenSize < 820 && (
          <OptionListMobile options={mobileOptions}>
            <Button bgColor="translucent" size="tiny" className="m-1" rounded hover clickEffect>
              <TfiMoreAlt className="w-3.5 h-3.5 text-blackrotate-90" />
            </Button>
          </OptionListMobile>
        )}
      </div>
    </div>
  )
}
