/*
  Usage:
    1. import and use <Dialog /> as a normal component in loyout.tsx or page.tsx
    2. import the 'dialog' function in whichever component you need, invoke 'dialog'
        and pass in necessary parameters
  
    When the 'dialog' function is invoked, a dialog will be displayed in the center of the 
  screen, with at least a confirm button
*/
import { useState } from "react"
import { createPortal } from "react-dom"
import Button from "./Button"

interface Props {
  title: string
  content?: string
  confirmText: string
  cancelText?: string
  confirmCallback?: (...args: any[]) => void
}

let changeShowDialog: React.Dispatch<React.SetStateAction<boolean>>
let changeProps: React.Dispatch<React.SetStateAction<Props>>
export function dialog(props: Props) {
  changeShowDialog(true)
  changeProps(props)
}

export default function Dialog() {
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [props, setProps] = useState<Props>({
    title: "",
    content: "",
    confirmText: "",
    cancelText: "",
    confirmCallback: () => {},
  })
  changeShowDialog = setShowDialog
  changeProps = setProps

  function handleClickBackground(event: React.MouseEvent) {
    if (event.target === event.currentTarget) {
      setShowDialog(false)
    }
  }

  return (
    <>
      {showDialog &&
        createPortal(
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-gray-tp-3"
            onClick={handleClickBackground}>
            <div className="w-[414px] rounded-2xl bg-white">
              <div className="p-6 text-[28px] font-medium text-center leading-tight">{props.title}</div>
              <div className="p-4">
                <p className="text-center text-[15px]">{props.content}</p>
                <div className="mt-12 flex justify-between">
                  {props.cancelText && (
                    <Button
                      text={props.cancelText}
                      bgColor="gray"
                      clickEffect
                      click={() => setShowDialog(false)}
                      className="flex-1 mx-2 !h-10"
                    />
                  )}
                  <Button
                    text={props.confirmText}
                    bgColor="red"
                    clickEffect
                    click={() => {
                      props.confirmCallback && props.confirmCallback()
                      setShowDialog(false)
                    }}
                    className="flex-1 mx-2 !h-10"
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
