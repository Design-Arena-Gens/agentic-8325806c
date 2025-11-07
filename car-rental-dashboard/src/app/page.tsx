type DailyBooking = {
  offset: number;
  bookings: number;
  confirmed: number;
  pending: number;
  pickups: number;
  dropoffs: number;
  revenue: number;
  fleetUtilization: number;
  overdue: number;
  newCustomers: number;
};

type ReminderTask = {
  time: string;
  customer: string;
  vehicle: string;
  location: string;
  contact: string;
  status: "Confirmed" | "Pending" | "Attention";
  note?: string;
};

const statusStyles: Record<ReminderTask["status"], string> = {
  Confirmed:
    "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  Pending:
    "border-amber-200/80 bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  Attention:
    "border-rose-200/80 bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200",
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  compactDisplay: "short",
});

const detailedCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "standard",
  minimumFractionDigits: 0,
});

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const heroFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

const tableFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const generateDailyBookings = (today: Date): (DailyBooking & {
  date: Date;
  id: string;
})[] => {
  const blueprint: DailyBooking[] = [
    {
      offset: -3,
      bookings: 21,
      confirmed: 19,
      pending: 1,
      pickups: 10,
      dropoffs: 11,
      revenue: 9450,
      fleetUtilization: 0.8,
      overdue: 1,
      newCustomers: 4,
    },
    {
      offset: -2,
      bookings: 18,
      confirmed: 16,
      pending: 2,
      pickups: 9,
      dropoffs: 8,
      revenue: 8640,
      fleetUtilization: 0.74,
      overdue: 2,
      newCustomers: 3,
    },
    {
      offset: -1,
      bookings: 24,
      confirmed: 22,
      pending: 1,
      pickups: 13,
      dropoffs: 10,
      revenue: 11820,
      fleetUtilization: 0.86,
      overdue: 0,
      newCustomers: 6,
    },
    {
      offset: 0,
      bookings: 27,
      confirmed: 24,
      pending: 2,
      pickups: 14,
      dropoffs: 12,
      revenue: 13150,
      fleetUtilization: 0.88,
      overdue: 1,
      newCustomers: 7,
    },
    {
      offset: 1,
      bookings: 22,
      confirmed: 19,
      pending: 3,
      pickups: 12,
      dropoffs: 10,
      revenue: 10240,
      fleetUtilization: 0.83,
      overdue: 1,
      newCustomers: 5,
    },
    {
      offset: 2,
      bookings: 19,
      confirmed: 17,
      pending: 2,
      pickups: 9,
      dropoffs: 11,
      revenue: 9320,
      fleetUtilization: 0.79,
      overdue: 2,
      newCustomers: 3,
    },
    {
      offset: 3,
      bookings: 16,
      confirmed: 14,
      pending: 2,
      pickups: 8,
      dropoffs: 9,
      revenue: 8120,
      fleetUtilization: 0.71,
      overdue: 1,
      newCustomers: 2,
    },
  ];

  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return blueprint
    .map((entry) => {
      const date = new Date(startOfToday);
      date.setDate(startOfToday.getDate() + entry.offset);

      return {
        ...entry,
        date,
        id: date.toISOString(),
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

const getReminderTasks = (dateLabel: string): ReminderTask[] => [
  {
    time: "08:30",
    customer: "Olivia Carter",
    vehicle: "Hyundai Tucson",
    location: "Downtown Hub",
    contact: "+1 (555) 0198",
    status: "Confirmed",
    note: `Deliver EV charging card to ${dateLabel} desk`,
  },
  {
    time: "10:00",
    customer: "Marcus Lee",
    vehicle: "BMW 3 Series",
    location: "Airport Terminal 1",
    contact: "+1 (555) 4433",
    status: "Pending",
    note: "Awaiting proof of insurance",
  },
  {
    time: "13:45",
    customer: "Priya Patel",
    vehicle: "Toyota Highlander",
    location: "Waterfront Branch",
    contact: "+1 (555) 2277",
    status: "Confirmed",
    note: "Install two child seats",
  },
  {
    time: "17:15",
    customer: "Jackson Reed",
    vehicle: "Ford Transit",
    location: "Corporate Delivery - 5th Ave",
    contact: "+1 (555) 7411",
    status: "Attention",
    note: "Vehicle requires full detailing tonight",
  },
];

export default function Home() {
  const today = new Date();
  const dailyBookings = generateDailyBookings(today);

  const maxBookings = Math.max(
    ...dailyBookings.map((day) => day.bookings),
    1,
  );

  const totalBookings = dailyBookings.reduce(
    (sum, day) => sum + day.bookings,
    0,
  );
  const totalRevenue = dailyBookings.reduce(
    (sum, day) => sum + day.revenue,
    0,
  );
  const averageUtilization =
    dailyBookings.reduce((sum, day) => sum + day.fleetUtilization, 0) /
    dailyBookings.length;

  const todayData =
    dailyBookings.find((day) => day.offset === 0) ??
    dailyBookings[dailyBookings.length - 1];
  const nextDayData =
    dailyBookings.find((day) => day.offset === 1) ??
    dailyBookings[dailyBookings.length - 1];

  const reminderTasks = getReminderTasks(dayFormatter.format(nextDayData.date));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white py-10 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 sm:px-8 lg:px-10">
        <header className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/80 px-8 py-7 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Car Rental Booking Control Center
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Monitor daily performance metrics and stay ahead of tomorrow&apos;s
                fleet commitments.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-sm text-slate-500 shadow-inner dark:border-slate-700 dark:bg-slate-900">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live as of {heroFormatter.format(todayData.date)}
            </div>
          </div>
          <dl className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                7-day bookings
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {totalBookings}
              </dd>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {dailyBookings.length} day window
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Fleet utilization
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {(averageUtilization * 100).toFixed(0)}%
              </dd>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Target 82% this week
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Today&apos;s pickups
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {todayData.pickups}
              </dd>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {todayData.pending} awaiting confirmation
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/60">
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Revenue (7 days)
              </dt>
              <dd className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {currencyFormatter.format(totalRevenue)}
              </dd>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {detailedCurrencyFormatter.format(nextDayData.revenue)} booked for{" "}
                {dayFormatter.format(nextDayData.date)}
              </p>
            </div>
          </dl>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
          <div className="grid gap-6">
            <article className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60">
              <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Day-wise booking trend</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Compare demand patterns and utilization across the current week.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600">
                    Last 7 days
                  </button>
                  <button className="rounded-full border border-transparent px-3 py-1 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                    Last 14 days
                  </button>
                </div>
              </header>

              <div className="mt-6 space-y-4">
                {dailyBookings.map((day) => (
                  <div
                    key={day.id}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-transparent px-3 py-2 transition-colors hover:border-slate-200 hover:bg-slate-50/90 dark:hover:border-slate-700 dark:hover:bg-slate-900/80"
                  >
                    <div className="w-24 text-sm font-medium text-slate-600 dark:text-slate-300 sm:w-28">
                      {dayFormatter.format(day.date)}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="block h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                            style={{
                              width: `${Math.max(
                                (day.bookings / maxBookings) * 100,
                                6,
                              ).toFixed(2)}%`,
                            }}
                          />
                        </div>
                        <span className="w-16 text-right text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {day.bookings}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          Confirmed{" "}
                          <strong className="font-semibold text-slate-700 dark:text-slate-200">
                            {day.confirmed}
                          </strong>
                        </span>
                        <span>
                          Pending{" "}
                          <strong className="font-semibold text-amber-600 dark:text-amber-300">
                            {day.pending}
                          </strong>
                        </span>
                        <span>
                          Drop-offs{" "}
                          <strong className="font-semibold text-slate-700 dark:text-slate-200">
                            {day.dropoffs}
                          </strong>
                        </span>
                        <span>
                          Utilization{" "}
                          <strong className="font-semibold text-slate-700 dark:text-slate-200">
                            {(day.fleetUtilization * 100).toFixed(0)}%
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 dark:border-slate-800/80">
                <div>
                  <h2 className="text-xl font-semibold">Operations breakdown</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Day-wise booking mix, logistics, and revenue pipeline.
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  {tableFormatter.format(
                    dailyBookings[0].date,
                  )}{" "}
                  –{" "}
                  {tableFormatter.format(
                    dailyBookings[dailyBookings.length - 1].date,
                  )}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                  <thead className="bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
                    <tr>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-center">Bookings</th>
                      <th className="px-4 py-3 text-center">Confirmed</th>
                      <th className="px-4 py-3 text-center">Pending</th>
                      <th className="px-4 py-3 text-center">Pickups</th>
                      <th className="px-4 py-3 text-center">Drop-offs</th>
                      <th className="px-4 py-3 text-right">Revenue</th>
                      <th className="px-4 py-3 text-center">Utilization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white/70 dark:divide-slate-800 dark:bg-slate-900/60">
                    {dailyBookings.map((day) => (
                      <tr key={day.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <td className="whitespace-nowrap px-6 py-3 font-medium text-slate-700 dark:text-slate-200">
                          {tableFormatter.format(day.date)}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-slate-700 dark:text-slate-200">
                          {day.bookings}
                        </td>
                        <td className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-300">
                          {day.confirmed}
                        </td>
                        <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-300">
                          {day.pending}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                          {day.pickups}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                          {day.dropoffs}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-700 dark:text-slate-200">
                          {detailedCurrencyFormatter.format(day.revenue)}
                        </td>
                        <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">
                          {(day.fleetUtilization * 100).toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>

          <aside className="flex h-full flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/60">
            <div>
              <h2 className="text-xl font-semibold">Next-day reminder</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Prep checklist for{" "}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {heroFormatter.format(nextDayData.date)}
                </span>
                .
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-sm dark:border-slate-800/80 dark:bg-slate-900/60">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 3v3m9-3v3M4.5 9.75h15m-13.5 3h4.5m-4.5 3h6m5.25-6.75V19.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5V9.75h12Z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Tomorrow&apos;s summary
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {nextDayData.pickups} pickups · {nextDayData.dropoffs} drop-offs
                </p>
              </div>
            </div>
            <dl className="grid gap-3 rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-sm dark:border-slate-800/80 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Pending confirmations</dt>
                <dd className="font-semibold text-amber-600 dark:text-amber-300">
                  {nextDayData.pending}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Vehicles requiring prep</dt>
                <dd className="font-semibold text-rose-600 dark:text-rose-300">
                  {nextDayData.overdue}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">New customers</dt>
                <dd className="font-semibold text-slate-700 dark:text-slate-200">
                  {nextDayData.newCustomers}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500 dark:text-slate-400">Projected revenue</dt>
                <dd className="font-semibold text-slate-700 dark:text-slate-200">
                  {detailedCurrencyFormatter.format(nextDayData.revenue)}
                </dd>
              </div>
            </dl>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Action list
              </h3>
              <ul className="space-y-3">
                {reminderTasks.map((task) => (
                  <li
                    key={`${task.time}-${task.customer}`}
                    className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50/80 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {task.time}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {task.vehicle}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-300">
                          {task.customer} · {task.location}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[task.status]}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{task.contact}</span>
                      {task.note && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[0.7rem] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m3.5 8.5 5 5 8-11"
                            />
                          </svg>
                          {task.note}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
              <button className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400">
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.167 10H15.83m0 0L11.5 5.667M15.83 10 11.5 14.333"
                  />
                </svg>
                Send reminders
              </button>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 underline-offset-4 transition hover:text-slate-800 hover:underline dark:text-slate-400 dark:hover:text-slate-200">
                Export schedule
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
