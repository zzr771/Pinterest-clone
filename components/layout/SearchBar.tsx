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

  const keyword = usePathname().split("/").pop()
  const routeName = usePathname().split("/")[1]
  const [isFocused, setIsFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const focusClass = isFocused ? "shadow-blue" : ""
  const searchBarContainer = useRef<HTMLDivElement>(null)

  function handleClick() {
    if (isFocused) {
      return
    }
    setIsFocused(true)
    dispatch(setShowModal(true))
    document.addEventListener("click", handleClickOutSide)
  }

  /*
      Every time a state changes, all the code of the component will be excuted again.
    If handleClickOutSide is a normal function, it will be repetitively created, each
    time its memory address is different. So in handleClick, addEventListener will
    add lots of 'handleClickOutSide' to the click listener.
  */
  const handleClickOutSide = useCallback((event: MouseEvent) => {
    if (!searchBarContainer?.current?.contains(event.target as Node)) {
      hideSearchSuggestion()
      setSearchTerm(keyword || "")
    }
  }, [])

  function handleClickClearBtn(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
    hideSearchSuggestion()
    setSearchTerm("")
  }

  function handleEnterDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || searchTerm.trim() === "") {
      return
    }

    // save the search term in localStorage with LRU algorithm. Capacity: 10
    let recentResearches = JSON.parse(localStorage.getItem("pinterest_recentSearches") || "[]")
    if (!recentResearches.includes(searchTerm)) {
      if (recentResearches.length >= 10) {
        recentResearches.pop()
      }
      recentResearches.unshift(searchTerm)
    } else {
      recentResearches = recentResearches.filter((item: string) => item !== searchTerm)
      recentResearches.unshift(searchTerm)
    }
    localStorage.setItem("pinterest_recentSearches", JSON.stringify(recentResearches))

    hideSearchSuggestion()
    router.push(`/search/${searchTerm.trim()}`)
  }

  function hideSearchSuggestion() {
    setIsFocused(false)
    dispatch(setShowModal(false))
    document.removeEventListener("click", handleClickOutSide)
  }

  // If users type the search keyword in the address bar to initiate a search, the 'searchTerm' should change accordingly
  useEffect(() => {
    if (keyword) {
      setSearchTerm(keyword)
    }
  }, [keyword])

  // When users navigate to other routes, clear the 'searchTerm'
  useEffect(() => {
    if (routeName !== "search") {
      setSearchTerm("")
    }
  }, [routeName])

  return (
    <div
      ref={searchBarContainer}
      onClick={handleClick}
      className={`relative flex flex-1 items-center min-w-72 h-[48px] pl-[16px] mx-2 gap-[8px] text-base 
      rounded-full bg-gray-bg-1 hover:bg-gray-bg-4 ${focusClass}`}>
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
      />

      {isFocused && (
        <div
          className="flex justify-center items-center w-12 h-12 rounded-full hover:bg-[#D4D4D4] cursor-pointer"
          onClick={handleClickClearBtn}>
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
