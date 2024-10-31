"use client"
import { Slide } from "react-slideshow-image"

import image1 from "@/public/assets/undone functions/pin-detail1.jpg"
import image2 from "@/public/assets/undone functions/pin-detail2.jpg"
import image3 from "@/public/assets/undone functions/pin-detail3.jpg"
import image4 from "@/public/assets/undone functions/pin-detail4.jpg"
import image5 from "@/public/assets/undone functions/pin-detail5.jpg"
import Image from "next/image"
const images = [image5, image2, image3, image4, image1]
export default function SlideBannerMobile() {
  return (
    <Slide
      arrows={false}
      indicators={true}
      transitionDuration={500}
      autoplay={false}
      cssClass="indicator-container">
      {images.map((item) => (
        <div className="each-slide-effect" key={item.src}>
          <div className="relative w-screen aspect-square">
            <Image
              className="object-cover"
              src={item.src}
              alt="slide banner"
              fill
              sizes="100vw"
              quality={100}
            />
          </div>
        </div>
      ))}
    </Slide>
  )
}
