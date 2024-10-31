"use client"

import ErrorComponent from "@/components/shared/ErrorComponent"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorComponent error={error} reset={reset} />
}
