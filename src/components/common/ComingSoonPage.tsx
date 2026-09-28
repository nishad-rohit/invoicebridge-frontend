import PageHeader from './PageHeader'

interface ComingSoonPageProps {
  title: string
  description: string
}

export default function ComingSoonPage({
  title,
  description,
}: ComingSoonPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="rounded-lg border border-slate-200 bg-white px-5 py-8">
        <p className="text-sm text-slate-600">
          Coming in the next implementation step.
        </p>
      </div>
    </div>
  )
}
