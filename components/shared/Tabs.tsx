interface Props {
  tabs: string[]
  selectedTab: string
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>
}
export default function Tabs({ tabs, selectedTab, setSelectedTab }: Props) {
  return (
    <div className="flex justify-center px-4 pb-4 gap-4">
      {tabs.map((item) => (
        <div
          key={item}
          onClick={() => {
            setSelectedTab(item)
          }}
          className={`relative p-2 font-medium text-base cursor-pointer rounded-lg
          ${selectedTab === item ? "" : "hover:bg-gray-bg-4"}`}>
          {item}
          <div
            className={`absolute w-[calc(100%-16px)] top-[40px] h-[3px] rounded-full bg-black
          ${selectedTab === item ? "bg-black" : "bg-transparent"}
          `}></div>
        </div>
      ))}
    </div>
  )
}
