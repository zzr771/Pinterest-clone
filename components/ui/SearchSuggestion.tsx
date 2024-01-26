import { useState } from "react"
import { IoMdClose } from "react-icons/io"
import SearchSuggestionCard from "../cards/SearchSuggestionCard"

export default function SearchSuggestion() {
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem("pinterest_recentSearches") || "[]")
  )

  // localStorage.setItem(
  //   "pinterest_recentSearches",
  //   JSON.stringify(["Office inspiration", "new year", "Model Y", "Space X", "Falcon 9"])
  // )

  function deleteSearchTerm(searchTerm: string, event: React.MouseEvent) {
    event.stopPropagation()
    const updatedSearches = recentSearches.filter((item: string) => item !== searchTerm)
    localStorage.setItem("pinterest_recentSearches", JSON.stringify(updatedSearches))
    setRecentSearches(updatedSearches)
  }

  function searchClickedTerm(item: string) {
    // todo
  }

  const suggestionCardArray = [1, 2, 3, 4, 5, 6, 7]

  return (
    <div className="bg-white rounded-b-2xl p-8">
      {recentSearches.length > 0 && (
        <>
          <h3 className="font-semibold text-base">Recent searches</h3>
          <div className="flex gap-2 mt-5">
            {recentSearches.map((item: string) => (
              <div
                className="flex gap-2 items-center bg-gray-bg-4 rounded-full py-1 px-3 cursor-pointer hover:bg-[#DADADA]"
                key={item}
                onClick={() => searchClickedTerm(item)}>
                <span>{item}</span>
                <div
                  className="flex justify-center items-center w-6 h-6 rounded-full hover:bg-[#CDCDCD] text-black"
                  onClick={(event: React.MouseEvent) => deleteSearchTerm(item, event)}>
                  <IoMdClose />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="font-semibold text-base mt-7">Ideas for you</h3>
      <div className="grid grid-cols-3 3xl:grid-cols-4 gap-2 mt-5">
        {suggestionCardArray.map((item) => (
          <SearchSuggestionCard
            image="/assets/searchSuggestionCardImage.jpg"
            title="Office inspiration"
            id=""
            key={item}
          />
        ))}
      </div>

      <h3 className="font-semibold text-base mt-7">Popular on Pinterest</h3>
      <div className="grid grid-cols-3 3xl:grid-cols-4 gap-2 mt-5">
        {suggestionCardArray.map((item) => (
          <SearchSuggestionCard
            image="/assets/searchSuggestionCardImage.jpg"
            title="Office inspiration"
            id=""
            key={item}
          />
        ))}
      </div>
    </div>
  )
}
