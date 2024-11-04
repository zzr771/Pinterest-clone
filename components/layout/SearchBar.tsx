"use client"

import { FaSearch } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"
import { useState, useRef, useCallback, useEffect } from "react"
import SearchSuggestion from "./SearchSuggestion"
import { useAppDispatch } from "@/lib/store/hook"
import { setShowModal } from "@/lib/store/features/modal"
import { usePathname, useRouter } from "next/navigation"

export default function SearchBar() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isFocused, setIsFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const focusClass = isFocused ? "shadow-blue" : ""
  const searchBarContainer = useRef<HTMLDivElement>(null)

  const pathName = usePathname()
  const keyword = useRef(decodeURIComponent(pathName.split("/").pop() || ""))
  const routeName = useRef(pathName.split("/")[1])
  useEffect(() => {
    keyword.current = decodeURIComponent(pathName.split("/").pop() || "")
    routeName.current = pathName.split("/")[1]
  }, [pathName])

  function handleClick() {
    if (isFocused) {
      return
    }
    setIsFocused(true)
    dispatch(setShowModal(true))
    document.addEventListener("click", handleClickOutSide)
  }
  const hideSearchSuggestion = useCallback(() => {
    setIsFocused(false)
    dispatch(setShowModal(false))
    document.removeEventListener("click", handleClickOutSideRef.current)
  }, [])

  /*
      Every time a state changes, all the code of the component will be excuted again.
    If handleClickOutSide is a normal function, it will be repetitively created, each
    time its memory address is different. So in handleClick, addEventListener will
    add lots of 'handleClickOutSide' to the click listener.
  */

  const handleClickOutSide = useCallback(
    (event: MouseEvent) => {
      if (!searchBarContainer?.current?.contains(event.target as Node)) {
        hideSearchSuggestion()
        setSearchTerm(keyword.current || "")
      }
    },
    [hideSearchSuggestion]
  )
  const handleClickOutSideRef = useRef(handleClickOutSide)
  useEffect(() => {
    handleClickOutSideRef.current = handleClickOutSide
  }, [handleClickOutSide])

  function handleClickClearBtn(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
    hideSearchSuggestion()
    setSearchTerm("")
    router.push("/")
  }

  function handleEnterDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const searchTermTrimed = searchTerm.trim()
    if (event.key !== "Enter" || searchTermTrimed === "") {
      return
    }

    // save the search term in localStorage with LRU algorithm. Capacity: 10
    let recentResearches = JSON.parse(localStorage.getItem("pinterest_recentSearches") || "[]")
    if (!recentResearches.includes(searchTermTrimed)) {
      if (recentResearches.length >= 10) {
        recentResearches.pop()
      }
      recentResearches.unshift(searchTermTrimed)
    } else {
      recentResearches = recentResearches.filter((item: string) => item !== searchTermTrimed)
      recentResearches.unshift(searchTermTrimed)
    }
    localStorage.setItem("pinterest_recentSearches", JSON.stringify(recentResearches))

    hideSearchSuggestion()
    router.push(`/search/${encodeURIComponent(searchTermTrimed)}`)
  }

  // If users type the search keyword in the address bar to initiate a search, the 'searchTerm' should change accordingly
  useEffect(() => {
    // In route '/user', the URL always ends with 'created' or 'saved'. Prevent these two words from being set as 'searchTerm'
    if (keyword.current && pathName.indexOf("/user") === -1) {
      setSearchTerm(keyword.current || "")
    }
  }, [pathName])

  // When users navigate to other routes, clear the 'searchTerm'
  useEffect(() => {
    if (routeName.current !== "search") {
      setSearchTerm("")
    }
  }, [pathName])

  return (
    <div
      ref={searchBarContainer}
      onClick={handleClick}
      className={`relative flex flex-1 items-center min-w-72 h-[48px] pl-[16px] mx-2 gap-[8px] text-base 
      rounded-full bg-gray-bg-1 hover:bg-gray-bg-4 ${focusClass}`}
      data-test="nav-search">
      {/* This icon should be hidden when clicked.  && expression can't be used here. Otherwise if you 
          click on this icon, it will be removed from searchBarContainer immediately, and the click event 
          can't bubble to searchBarContainer whose handleClick function won't be fired.
        */}
      <FaSearch className="text-gray-font-3" />

      <input
        type="text"
        placeholder="Search"
        className="flex-1 outline-none bg-transparent text-gray-font-1"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleEnterDown}
        data-test="search-input"
      />

      {isFocused && (
        <div
          className="flex justify-center items-center w-12 h-12 rounded-full hover:bg-[#D4D4D4] cursor-pointer"
          onClick={handleClickClearBtn}
          data-test="search-suggestion-close">
          <IoMdCloseCircle className="text-black w-5 h-5" />
        </div>
      )}

      {isFocused && (
        <div className="absolute top-[48px] left-0 w-full">
          <SearchSuggestion setSearchTerm={setSearchTerm} hideSearchSuggestion={hideSearchSuggestion} />
        </div>
      )}
    </div>
  )
}
