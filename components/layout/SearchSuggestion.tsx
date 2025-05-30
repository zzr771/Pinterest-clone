import { useState } from "react"
import { IoMdClose } from "react-icons/io"
import SearchSuggestionCard from "../cards/SearchSuggestionCard"
import { ideasArray, popularArray } from "@/constants/index"
import { useRouter } from "next/navigation"

interface Props {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  hideSearchSuggestion: () => void
}
export default function SearchSuggestion({ setSearchTerm, hideSearchSuggestion }: Props) {
  const router = useRouter()
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("pinterest_recentSearches") || "[]")
  )

  function deleteSearchTerm(searchTerm: string) {
    const updatedSearches = recentSearches.filter((item: string) => item !== searchTerm)
    localStorage.setItem("pinterest_recentSearches", JSON.stringify(updatedSearches))
    setRecentSearches(updatedSearches)
  }

  function searchClickedTerm(term: string) {
    setSearchTerm(term)
    hideSearchSuggestion()

    // change the search term's position in localStorage to the first place.
    let recentResearches = JSON.parse(localStorage.getItem("pinterest_recentSearches") || "[]")
    recentResearches = recentResearches.filter((item: string) => item !== term)
    recentResearches.unshift(term)
    localStorage.setItem("pinterest_recentSearches", JSON.stringify(recentResearches))

    router.push(`/search/${encodeURIComponent(term)}`)
  }

  return (
    <div
      className={"p-8 bg-white rounded-b-2xl max-h-[calc(100vh-80px)] shadow-bottom overflow-y-auto"}
      data-test="search-suggestion-wrapper">
      {recentSearches.length > 0 && (
        <>
          <h3 className="font-medium text-base">Recent searches</h3>
          <div className="flex flex-wrap gap-2 mt-5">
            {recentSearches.map((item: string) => (
              <div
                className="flex gap-2 items-center bg-gray-bg-4 rounded-full py-1 px-3 cursor-pointer hover:bg-[#DADADA] whitespace-nowrap"
                key={item}
                onClick={() => searchClickedTerm(item)}
                data-test="search-history-item">
                <span>{item}</span>
                <div
                  className="flex justify-center items-center w-6 h-6 rounded-full hover:bg-[#CDCDCD] text-black"
                  onClick={(event: React.MouseEvent) => {
                    event.nativeEvent.stopImmediatePropagation() // stop bubbling to other native DOM click handlers
                    event.stopPropagation() // stop bubbling to react onClick event handlers
                    deleteSearchTerm(item)
                  }}>
                  <IoMdClose />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="font-medium text-base mt-7">Ideas for you</h3>
      <div className="grid grid-cols-3 w7:grid-cols-4 gap-2 mt-5">
        {ideasArray.map((item) => (
          <SearchSuggestionCard image={item.image} title={item.title} id="" key={item.title} />
        ))}
      </div>

      <h3 className="font-medium text-base mt-7">Popular on Pinterest</h3>
      <div className="grid grid-cols-3 w7:grid-cols-4 gap-2 mt-5">
        {popularArray.map((item) => (
          <SearchSuggestionCard image={item.image} title={item.title} id="" key={item.title} />
        ))}
      </div>
    </div>
  )
}
