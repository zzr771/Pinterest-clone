interface Props {
  image: string
  title: string
  id: string
}
export default function SearchSuggestionCard({ image, title, id }: Props) {
  function handleClick() {
    // todo
  }
  return (
    <div
      className="flex flex-1 overflow-hidden rounded-2xl bg-gray-bg-3 aspect-[2.5/1] cursor-pointer"
      onClick={handleClick}>
      <img src={image} alt="search suggestion" className="aspect-square object-cover object-center" />
      <div className="flex items-center p-4">
        <span className="font-semibold lg:text-base text-sm">{title}</span>
      </div>
    </div>
  )
}
