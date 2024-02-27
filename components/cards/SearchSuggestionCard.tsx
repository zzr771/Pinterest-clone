import Image from "next/image"

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
      <div className="relative h-full aspect-square">
        <Image
          src={image}
          alt="search suggestion"
          className="h-full aspect-square object-cover object-center"
          fill
          sizes="(min-width: 1700px) calc(10vw - 58px), (min-width: 920px) calc(13.29vw - 75px), calc(12.5vw - 50px)"
        />
      </div>

      <div className="flex items-center p-4 text-ellipsis overflow-hidden">
        <span className="text-ellipsis overflow-hidden font-medium text-sm xl:text-base max-lg:text-xs">
          {title}
        </span>
      </div>
    </div>
  )
}
