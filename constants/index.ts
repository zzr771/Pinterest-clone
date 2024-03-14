/*
  在数据库中，每一个user都有一个数组 pinRecord 来记录本次访问中所有显示过的 pin 的 _id
    当滚动页面触发请求获取更多 pins 时，服务器将挑选 _id 不在 pinRecord 中的 pin 返回给
    客户端
  当用户打开应用或者刷新应用时，页面将发送一个“第一次获取pins”的请求，这个请求将携带一个
    参数，用于告诉服务器把 pinRecord 数组清空。
*/
import { pinCovers } from "./images"

function getCardNumber(screenWidth: number) {
  switch (true) {
    case screenWidth <= 540:
      return 12
    case screenWidth <= 1024:
      return 15
    case screenWidth <= 1440:
      return 25
    case screenWidth <= 1920:
      return 30
    default:
      return 40
  }
}

interface Image {
  id: string
  src: string
  width: number
  height: number
}

const records: Image[] = []
function getInitialPinCardImgs(screenWidth: number) {
  const number = getCardNumber(screenWidth)
  return new Promise<Image[]>((resolve, reject) => {
    setTimeout(() => {
      const result = pinCovers.slice(0, number)
      records.push(...result)
      resolve(result)
    })
  })
}

function getMorePinCardImgs(screenWidth: number) {
  const number = getCardNumber(screenWidth)
  const targetNumber = number + records.length
  const result: Image[] = []

  return new Promise<Image[]>((resolve, reject) => {
    let i = 0
    while (records.length < targetNumber && i < pinCovers.length) {
      const img = pinCovers[i]
      if (!records.includes(img)) {
        records.push(img)
        result.push(img)
      }
      i++
    }

    setTimeout(() => {
      resolve(result)
    })
  })
}

const reactionIcons = [
  { name: "Good idea", src: "/assets/reactions/good-idea.svg" },
  { name: "Love", src: "/assets/reactions/love.svg" },
  { name: "Thanks", src: "/assets/reactions/thanks.svg" },
  { name: "Wow", src: "/assets/reactions/wow.svg" },
  { name: "Haha", src: "/assets/reactions/haha.svg" },
]

export { getInitialPinCardImgs, getCardNumber, getMorePinCardImgs, reactionIcons }
