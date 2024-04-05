import Button from "@/components/shared/Button"
import toast from "react-hot-toast"

interface Props {
  message: string
  button?: {
    text: string
    callback: Function
  }
}
export default function showMessageBox({ message, button }: Props) {
  const element = (
    <div className="flex items-center gap-4 px-4 py-3 bg-black rounded-2xl text-white text-[15px] font-light">
      {message}
      {button && <Button size="small" bgColor="gray" text={button.text} clickEffect />}
    </div>
  )
  const position = window.innerWidth < 820 ? "top-center" : "bottom-center"
  toast.custom(element, { position })
}
