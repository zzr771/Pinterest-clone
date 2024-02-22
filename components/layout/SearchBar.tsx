"use client"

import { FaSearch } from "react-icons/fa"
import { IoMdCloseCircle } from "react-icons/io"
import { useState, useRef, useMemo } from "react"
import SearchSuggestion from "./SearchSuggestion"
import { useAppDispatch } from "@/lib/store/hook"
import { setShowSearchSuggestion } from "@/lib/store/features/searchSuggestion"

export default function SearchBar() {
  const dispatch = useAppDispatch()
  const [isFocused, setIsFocused] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const focusClass = isFocused ? "shadow-blue" : ""

  const searchBarContainer = useRef<HTMLDivElement>(null)
  function handleClick() {
    if (isFocused) {
      return
    }
    setIsFocused(true)
    dispatch(setShowSearchSuggestion(true))
    document.addEventListener("click", handleClickOutSide)
  }

  /*
    Every time a state changes, all the code of the component will be excuted again.
    If handleClickOutSide is a normal function, it will be repetitively created, while
    each time its memory address is different. So in handleClick, addEventListener will
    add handleClickOutSide repetitively.
  */
  const handleClickOutSide = useMemo(() => {
    return (event: MouseEvent) => {
      if (!searchBarContainer?.current?.contains(event.target as Node)) {
        setSearchTerm("")
        setIsFocused(false)
        dispatch(setShowSearchSuggestion(false))
        document.removeEventListener("click", handleClickOutSide)
      }
    }
  }, [])

  function handleClickClearBtn(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation()
    setSearchTerm("")
    setIsFocused(false)
    document.removeEventListener("click", handleClickOutSide)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return
    }

    // todo: start search and let searchbar blur

    // push search term in localstorage. Maximum number: 5
    let recentResearches = JSON.parse(localStorage.getItem("pinterest_recentSearches") || "[]")
    if (!recentResearches.includes(searchTerm)) {
      if (recentResearches.length < 5) {
        recentResearches.push(searchTerm)
      } else {
        recentResearches = recentResearches.slice(1)
        recentResearches.push(searchTerm)
      }
      localStorage.setItem("pinterest_recentSearches", JSON.stringify(recentResearches))
    }
  }

  return (
    <div
      ref={searchBarContainer}
      onClick={handleClick}
      className={`relative flex flex-1 items-center min-w-72 h-[48px] pl-[16px] mx-2 gap-[8px] text-base 
      rounded-full 
      bg-gray-bg-1 
      hover:bg-gray-bg-4 
      ${focusClass}`}>
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
        onKeyDown={handleKeyDown}
      />

      {isFocused && (
        <div
          className="flex justify-center items-center w-12 h-12 rounded-full hover:bg-[#D4D4D4] cursor-pointer"
          onClick={handleClickClearBtn}>
          <IoMdCloseCircle className="text-black w-5 h-5" />
        </div>
      )}

      {isFocused && (
        <div className="absolute top-[52px] left-0 w-full z-10">
          <SearchSuggestion />
        </div>
      )}
    </div>
  )
}
