import { ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-sky-200 backdrop-blur">
            <Sparkles className="h-4 w-4" />
            React + Tailwind CSS
          </div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Fresh TypeScript starter ready for shadcn/ui components.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Vite, Tailwind, and React are prewired so you can start building UI
            immediately. Add your components and routes, wire up data, and
            iterate fast.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="gap-2">
              Start building
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" asChild>
              <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
                Browse shadcn/ui
              </a>
            </Button>
          </div>
        </header>

        <section className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: 'Type-safe by default',
              body: 'Strict TypeScript settings are enabled to help catch issues early.',
            },
            {
              title: 'Tailwind ready',
              body: 'Utility-first styling with a minimal base layer you can extend.',
            },
            {
              title: 'Fast dev server',
              body: 'Vite gives instant feedback with hot module replacement.',
            },
            {
              title: 'shadcn/ui friendly',
              body: 'Install components as you need them for a consistent design system.',
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-sky-900/20 backdrop-blur"
            >
              <h2 className="text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{item.body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}

export default App
