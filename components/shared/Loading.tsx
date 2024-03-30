export default function Loading() {
  return (
    <div className="absolute inset-0 z-10 flex justify-center">
      <div className="absolute top-[20vh] max-w3:top-[48vh]">
        <svg
          aria-label="Loading Search Results"
          className="loading-spinner"
          height="40"
          role="img"
          viewBox="0 0 24 24"
          width="40">
          <path d="M15 10.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m-6-6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24"></path>
        </svg>
      </div>
    </div>
  )
}
