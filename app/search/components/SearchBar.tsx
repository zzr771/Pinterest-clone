"use client"

import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { IoMdClose } from "react-icons/io"

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])

  useEffect(() => {
    if (isFocused) {
      setRecentSearches(JSON.parse(localStorage.getItem("pinterest_recentSearches") || "[]"))
    }
  }, [isFocused])

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return
    }

    // todo: start search and let searchbar blur

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
  }

  function deleteSearchTerm(searchTerm: string) {
    const updatedSearches = recentSearches.filter((item: string) => item !== searchTerm)
    localStorage.setItem("pinterest_recentSearches", JSON.stringify(updatedSearches))
    setRecentSearches(updatedSearches)
  }

  function searchClickedTerm(item: string) {
    // todo
  }
  return (
    <div className="relative">
      {/* search input */}
      <div
        className={`fixed z-10 top-0 left-0 right-0 py-3 px-2 ${isFocused ? "bg-white" : "bg-transparent"}`}>
        <div className="flex items-center">
          <div
            className={`flex-1 flex items-center gap-2 h-12 pl-2 pr-5 rounded-full  bg-white border-gray-bg-6
            ${isFocused ? "border" : "border-2"}
            `}>
            <FaSearch className="w-4 h-4 text-gray-font-4" />
            <input
              onFocus={() => setIsFocused(true)}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-full font-light text-[15px]  text-black no-focus outline-none  focus-visible:!outline-none"
              type="text"
              placeholder="Search"
            />
          </div>
          {isFocused && (
            <div
              className="p-3 text-sm text-gray-font-4"
              onClick={() => {
                setIsFocused(false)
                setSearchTerm("")
              }}>
              Cancel
            </div>
          )}
        </div>
      </div>

      {/* recent searches list */}
      {/* 4.5rem: height of search input */}
      {isFocused && (
        <div className="fixed z-10 bg-white top-[4.5rem] w-screen h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-gray-bg-1">
          {recentSearches.map((item: string) => (
            <div
              key={item}
              onClick={() => searchClickedTerm(item)}
              className="flex items-center justify-between ml-4 py-1">
              <div className="flex items-center">
                <FaSearch className="m-3 mr-6 w-3 h-3 text-black" />
                <span className="font-medium">{item}</span>
              </div>
              <IoMdClose
                onClick={(event: React.MouseEvent) => {
                  event.nativeEvent.stopImmediatePropagation() // stop bubbling to other native DOM click handlers
                  event.stopPropagation() // stop bubbling to react onClick event handlers
                  deleteSearchTerm(item)
                }}
                className="w-5 h-5 mr-8 text-gray-font-4"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
