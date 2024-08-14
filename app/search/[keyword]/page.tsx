import WaterFall from "@/components/layout/WaterFall"

/*
    In this route, we use dynamic route instead of search params, because we want 
  next.js to cache the results of every search. 
    For instance, a user searches for "light", then searches for "beach", then clicks
  the browser's 'back' button. We hope that the contents about 'light' can be cached 
  so they can be displayed instantly.
    But next.js's router cache ignores search params. "/search?q=1" and "/search?q=2"
  means no difference to it. It only caches '/search' with the search param that you
  use to visit this route for the first time. In this case, it caches '/search' with
  parameter 'q=light' and doesn't cache '/search?q=beach'.
    So we use dynamic route instead.
*/
export default function Page({ params }: { params: { keyword: string } }) {
  const { keyword } = params

  return (
    <main className="w3:mt-20">
      <WaterFall requestName={"SEARCH_PINS"} param={{ keyword }} />
    </main>
  )
}
