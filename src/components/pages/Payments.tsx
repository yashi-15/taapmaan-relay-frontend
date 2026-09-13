import { useMemo, useState } from "react";
import {
  Search,
  Download,
  IndianRupee,
  Wallet,
  CalendarClock,
  ChevronDown,
  ArrowUpDown,
  X,
  Snowflake,
  Thermometer,
  Package,
} from "lucide-react";
import {
  duePayments as initialDue,
  paymentHistory as initialHistory,
  formatINR,
  formatDate,
  type TripPayment,
  type BookingType,
} from "../../utils/paymentsMock";
import { BookingTypeBadge, VehicleTypeBadge } from "../elements/VehicleBadges";

type Tab = "due" | "history";
type SortKey = "amount" | "date";
type SortDir = "asc" | "desc";

// const vehicleTypeStyles: Record<TripPayment["vehicleType"], string> = {
//   Frozen: "bg-sky-50 text-sky-700 border-sky-200",
//   Chiller: "bg-cyan-50 text-cyan-700 border-cyan-200",
//   Dry: "bg-amber-50 text-amber-800 border-amber-200",
// };

// const vehicleTypeIcon: Record<TripPayment["vehicleType"], React.ReactNode> = {
//   Frozen: <Snowflake className="h-3 w-3" />,
//   Chiller: <Thermometer className="h-3 w-3" />,
//   Dry: <Package className="h-3 w-3" />,
// };

// const bookingTypeStyles: Record<BookingType, string> = {
//   Adhoc: "bg-slate-100 text-slate-700 border-slate-200",
//   Dedicated: "bg-indigo-50 text-indigo-700 border-indigo-200",
// };

function generateUtr(): string {
  const stamp = Date.now().toString().slice(-9);
  return `UTR${stamp}`;
}

const Payments = () => {
  const [activeTab, setActiveTab] = useState<Tab>("due");
  const [due, setDue] = useState<TripPayment[]>(initialDue);
  const [history, setHistory] = useState<TripPayment[]>(initialHistory);

  const [search, setSearch] = useState("");
  const [bookingFilter, setBookingFilter] = useState<"All" | BookingType>("All");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [confirmTarget, setConfirmTarget] = useState<TripPayment | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const totalDue = useMemo(
    () => due.reduce((sum, p) => sum + p.amount, 0),
    [due]
  );

  const receivedThisMonth = useMemo(() => {
    const now = new Date();
    return history
      .filter((p) => {
        if (!p.receivedOn) return false;
        const d = new Date(p.receivedOn);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, p) => sum + p.amount, 0);
  }, [history]);

  const receivedThisYear = useMemo(() => {
    const now = new Date();
    return history
      .filter((p) => p.receivedOn && new Date(p.receivedOn).getFullYear() === now.getFullYear())
      .reduce((sum, p) => sum + p.amount, 0);
  }, [history]);

  const activeList = activeTab === "due" ? due : history;

  const visibleRows = useMemo(() => {
    let rows = activeList.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.tripId.toLowerCase().includes(search.toLowerCase()) ||
        p.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
        p.destination.toLowerCase().includes(search.toLowerCase()) ||
        p.origin.toLowerCase().includes(search.toLowerCase());
      const matchesBooking =
        bookingFilter === "All" || p.bookingType === bookingFilter;
      return matchesSearch && matchesBooking;
    });

    rows = [...rows].sort((a, b) => {
      let diff = 0;
      if (sortKey === "amount") {
        diff = a.amount - b.amount;
      } else {
        const dateA = activeTab === "due" ? a.completedOn : a.receivedOn ?? a.completedOn;
        const dateB = activeTab === "due" ? b.completedOn : b.receivedOn ?? b.completedOn;
        diff = new Date(dateA).getTime() - new Date(dateB).getTime();
      }
      return sortDir === "asc" ? diff : -diff;
    });

    return rows;
  }, [activeList, search, bookingFilter, sortKey, sortDir, activeTab]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const confirmReceive = () => {
    if (!confirmTarget) return;
    const received: TripPayment = {
      ...confirmTarget,
      status: "Received",
      receivedOn: new Date().toISOString().slice(0, 10),
      paymentMode: "NEFT",
      utrNumber: generateUtr(),
    };
    setDue((prev) => prev.filter((p) => p.id !== confirmTarget.id));
    setHistory((prev) => [received, ...prev]);
    setConfirmTarget(null);
    setToast(`Payment of ${formatINR(received.amount)} for ${received.tripId} received.`);
    window.setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-full bg-white text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Payments</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track payments for your completed trips and request payouts whenever you're ready.
          </p>
        </div>

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Wallet className="h-4 w-4 text-slate-400" />
              Total amount due
            </div>
            <div className="mt-2 flex items-center text-2xl font-semibold text-slate-900">
              <IndianRupee className="h-5 w-5" />
              {totalDue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-slate-400">{due.length} trip{due.length !== 1 ? "s" : ""} awaiting payout</p>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CalendarClock className="h-4 w-4 text-slate-400" />
              Received this month
            </div>
            <div className="mt-2 flex items-center text-2xl font-semibold text-slate-900">
              <IndianRupee className="h-5 w-5" />
              {receivedThisMonth.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-slate-400">Across all vehicles</p>
          </div>

          <div className="rounded-lg border border-slate-200 p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <IndianRupee className="h-4 w-4 text-slate-400" />
              Received this year
            </div>
            <div className="mt-2 flex items-center text-2xl font-semibold text-slate-900">
              <IndianRupee className="h-5 w-5" />
              {receivedThisYear.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="mt-1 text-xs text-slate-400">Year to date</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-5 flex gap-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("due")}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === "due" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Payments due
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {due.length}
            </span>
            {activeTab === "due" && (
              <span className="absolute -bottom-px left-0 h-0.5 w-full bg-[#173b5e]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === "history" ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Payment history
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {history.length}
            </span>
            {activeTab === "history" && (
              <span className="absolute -bottom-px left-0 h-0.5 w-full bg-[#173b5e]" />
            )}
          </button>
        </div>

        {/* Search + filter */}
        <div className="mb-4 flex flex-col gap-3 rounded-lg bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by trip ID, vehicle, route..."
              className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-[#173b5e] focus:outline-none focus:ring-1 focus:ring-[#173b5e]"
            />
          </div>
          <div className="relative">
            <select
              value={bookingFilter}
              onChange={(e) => setBookingFilter(e.target.value as "All" | BookingType)}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-3 pr-9 text-sm text-slate-700 focus:border-[#173b5e] focus:outline-none focus:ring-1 focus:ring-[#173b5e] sm:w-44"
            >
              <option value="All">All booking types</option>
              <option value="Adhoc">Adhoc</option>
              <option value="Dedicated">Dedicated</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="px-4 py-3">Trip</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Booking type</th>
                <th className="px-4 py-3">
                  <button
                    onClick={() => toggleSort("date")}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    {activeTab === "due" ? "Completed on" : "Received on"}
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-4 py-3">
                  <button
                    onClick={() => toggleSort("amount")}
                    className="flex items-center gap-1 hover:text-slate-700"
                  >
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                {activeTab === "history" && <th className="px-4 py-3">Reference</th>}
                <th className="px-4 py-3 text-right">
                  {activeTab === "due" ? "Action" : "Receipt"}
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-4">
                    <div className="font-medium text-slate-900">{p.tripId}</div>
                    <div className="text-xs text-slate-400">
                      {formatDate(p.workPeriodStart)} – {formatDate(p.workPeriodEnd)}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {p.origin} → {p.destination}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-slate-700">{p.vehicleNumber}</div>
                    <VehicleTypeBadge type={p.vehicleType} />
                  </td>
                  <td className="px-4 py-4">
                    <BookingTypeBadge type={p.bookingType} />
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {formatDate(activeTab === "due" ? p.completedOn : p.receivedOn ?? p.completedOn)}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-900">
                    {formatINR(p.amount)}
                  </td>
                  {activeTab === "history" && (
                    <td className="px-4 py-4 text-xs text-slate-500">
                      <div>{p.paymentMode}</div>
                      <div className="text-slate-400">{p.utrNumber}</div>
                    </td>
                  )}
                  <td className="px-4 py-4 text-right">
                    {activeTab === "due" ? (
                      <button
                        onClick={() => setConfirmTarget(p)}
                        className="rounded-md bg-[#173b5e] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0f2942]"
                      >
                        Receive payment
                      </button>
                    ) : (
                      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-[#173b5e] hover:underline">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {visibleRows.length === 0 && (
                <tr>
                  <td
                    colSpan={activeTab === "history" ? 7 : 6}
                    className="px-4 py-16 text-center text-sm text-slate-400"
                  >
                    {activeTab === "due"
                      ? "No payments due right now. Completed trips will show up here."
                      : "No payments received yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm receive-payment modal */}
      {confirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-start justify-between">
              <h2 className="text-base font-semibold text-slate-900">Confirm payment request</h2>
              <button
                onClick={() => setConfirmTarget(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Request payout of{" "}
              <span className="font-medium text-slate-900">{formatINR(confirmTarget.amount)}</span> for{" "}
              <span className="font-medium text-slate-900">{confirmTarget.tripId}</span>? This will
              be credited to your registered bank account.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmTarget(null)}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReceive}
                className="rounded-md bg-[#173b5e] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#0f2942]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
};

export default Payments;