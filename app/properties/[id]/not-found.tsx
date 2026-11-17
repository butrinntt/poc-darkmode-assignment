import Link from 'next/link'

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-surface-base text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-foreground">Property not found</h1>
        <p className="mt-2 text-foreground-muted">The property you are looking for does not exist.</p>
        <Link href="/properties" className="inline-flex mt-6 text-brand hover:text-brand-hover">
          Back to Properties
        </Link>
      </div>
    </div>
  )
}
