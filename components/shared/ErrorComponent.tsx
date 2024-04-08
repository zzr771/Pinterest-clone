import Button from "@/components/shared/Button"

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-lg">Oops, something went wrong.</h2>
        <Button text="Try again" bgColor="red" hover clickEffect click={() => reset()} className="mt-4" />
      </div>
    </main>
  )
}
