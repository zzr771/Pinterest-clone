"use client"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { HiOutlineHeart } from "react-icons/hi"
import { TfiMoreAlt } from "react-icons/tfi"
import Button from "../shared/Button"
import DropDownList from "../shared/DropDownList"
import Reply from "../form/Reply"
import useDropDownList from "@/lib/hooks/useDropDownList"
import InputModal from "../mobile/InputModal"
import OptionListMobile from "../mobile/OptionListMobile"

export default function CommentCard() {
  const [showReplyInput, setShowReplyInput] = useState(false) // PC
  const [showInputModal, setShowInputModal] = useState(false) // mobile
  const authorOptions = useRef([{ label: "Edit" }, { label: "Delete" }])

  const dropContainerRef = useRef<HTMLDivElement>(null)
  const [showAuthorOptions, setShowAuthorOptions] = useState(false)

  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useDropDownList({
    dropContainerRef,
    showDropDownList: showAuthorOptions,
    setShowDropDownList: setShowAuthorOptions,
  })

  useEffect(() => {
    if (window.innerWidth < 820) {
      setIsMobileDevice(true)
    } else {
      setIsMobileDevice(false)
    }
  }, [])

  function handleClick() {
    setShowReplyInput((prev) => !prev)
    setShowInputModal(true)
  }

  return (
    <div className="my-2.5">
      <div className="flex">
        {/* avatar image */}
        <div className="min-w-8 mr-2">
          <Image
            src="/assets/test/avatar2.jpg"
            width={32}
            height={32}
            alt="user avatar"
            className="rounded-full object-cover"
          />
        </div>

        <div>
          {/* main content */}
          <p>
            {/* user name */}
            <a className="font-semibold mr-1 hover:underline cursor-pointer">Louis</a>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda tempora delectus asperiores,
            error nam nulla rem, saepe nobis excepturi officia, libero ad nesciunt a officiis sint totam
            laborum dolorem? Ipsa?
          </p>

          {/* buttons */}
          <div className="flex text-gray-font-4 gap-5 text-sm">
            <div>13d</div>
            <div className="font-medium cursor-pointer" onClick={() => handleClick()}>
              Reply
            </div>
            <div className="flex items-center font-medium gap-1">
              <HiOutlineHeart className="w-5 h-5 cursor-pointer" />
              13
            </div>
            {/* show this button if the current user is the author of the comment */}
            <div ref={dropContainerRef} className="relative">
              <Button
                size="tiny"
                clickEffect
                hover
                rounded
                click={() => setShowAuthorOptions((prev) => !prev)}>
                <TfiMoreAlt className="text-gray-font-4" />
              </Button>
              {!isMobileDevice && showAuthorOptions && (
                <div className="horizontal-middle top-7">
                  <DropDownList options={authorOptions.current} />
                </div>
              )}
              {isMobileDevice && showAuthorOptions && (
                <OptionListMobile options={authorOptions.current} setShowList={setShowAuthorOptions} />
              )}
            </div>
          </div>
        </div>
      </div>

      {!isMobileDevice && showReplyInput && (
        <div className="mt-3 ml-12">
          <Reply
            close={() => {
              setShowReplyInput(false)
            }}
          />
        </div>
      )}

      {showInputModal && isMobileDevice && (
        <InputModal setShowInputModal={setShowInputModal} isComment={false} />
      )}

      {/* todo: replies */}
    </div>
  )
}
