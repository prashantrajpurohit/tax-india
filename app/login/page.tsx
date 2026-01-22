import { LoginForm } from "@/components/login-form"

export default function Page() {
  return (
    <div className="flex min-h-screen">
      {/* Left Half - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-12 xl:p-16">
        <div className="flex flex-col justify-center max-w-2xl mx-auto space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 shadow-sm ring-1 ring-emerald-100 w-fit">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Easy tax onboarding
          </span>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-slate-900 xl:text-5xl">
              File GST, PAN, and ITR without the stress
            </h1>
            <p className="text-lg text-slate-600">
              A friendly workspace to manage returns, track dues, and keep compliance in one place.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-emerald-100 backdrop-blur">
            <div className="absolute -left-16 -top-14 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-200 via-sky-100 to-white blur-3xl" />
            <div className="absolute -right-14 bottom-0 h-48 w-48 rounded-full bg-gradient-to-t from-amber-200 via-white to-pink-100 blur-3xl" />

            <div className="relative grid gap-4 grid-cols-3">
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-emerald-800">GST filings</div>
                <div className="mt-3 h-20 rounded-xl bg-gradient-to-r from-emerald-300 via-emerald-200 to-sky-200" />
                <p className="mt-3 text-xs text-emerald-900/70">Quarterly returns, invoices, and payment timelines.</p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-sky-800">PAN updates</div>
                <div className="mt-3 h-20 rounded-xl bg-gradient-to-r from-sky-300 via-sky-200 to-indigo-200" />
                <p className="mt-3 text-xs text-sky-900/70">Track corrections, e-KYC, and linked services.</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-amber-800">ITR ready</div>
                <div className="mt-3 h-20 rounded-xl bg-gradient-to-r from-amber-300 via-amber-200 to-pink-200" />
                <p className="mt-3 text-xs text-amber-900/70">Income snapshots and deductions at a glance.</p>
              </div>
            </div>

            <div className="relative mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
              <span className="rounded-full bg-slate-900 px-3 py-1 text-white">Secure by default</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">Smart reminders</span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-sky-800">CA-friendly uploads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Half - Login Form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <LoginForm className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-200" />
        </div>
      </div>
    </div>
  )
}
