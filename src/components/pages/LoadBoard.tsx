import React, { useState, useMemo } from "react";
import {
  Plus,
  Truck,
  MapPin,
  Calendar,
  Thermometer,
  Snowflake,
  Package,
  X,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { VehicleTypeBadge } from "../elements/VehicleBadges";


// ---------------------------------------------------------------------------
// Mock data — replace with real vendor resources + API calls when wiring up
// ---------------------------------------------------------------------------
const VENDOR_VEHICLES = [
  { id: "v1", number: "MH-04-GT-2216", type: "Frozen" },
  { id: "v2", number: "MH-12-AB-7741", type: "Chiller" },
  { id: "v3", number: "GJ-01-JK-9002", type: "Dry" },
];

const VENDOR_DRIVERS = [
  { id: "d1", name: "Ramesh Yadav", phone: "98xxxxxx12" },
  { id: "d2", name: "Suresh Pawar", phone: "97xxxxxx45" },
  { id: "d3", name: "Irfan Sheikh", phone: "99xxxxxx88" },
];

const TRUCK_TYPES = [
  { value: "Frozen", icon: Snowflake },
  { value: "Chiller", icon: Thermometer },
  { value: "Dry", icon: Package },
];

const STATUS_STYLES = {
  Active: { dot: "bg-[#0B6E4F]", text: "text-[#0B6E4F]" },
  Matched: { dot: "bg-[#B4690E]", text: "text-[#B4690E]" },
  Expired: { dot: "bg-[#8A9299]", text: "text-[#8A9299]" },
};

const INITIAL_POSTINGS = [
  {
    id: "p1",
    vehicleNumber: "MH-14-CD-5590",
    vehicleType: "Chiller",
    driverName: "Vikas More",
    origin: "Pune, MH",
    destination: "Open to any",
    availableFrom: "2026-09-02T09:00",
    availableUntil: "2026-09-03T18:00",
    capacity: "9",
    rate: "34",
    status: "Active",
  },
  {
    id: "p2",
    vehicleNumber: "MH-04-GT-2216",
    vehicleType: "Frozen",
    driverName: "Ramesh Yadav",
    origin: "Nashik, MH",
    destination: "Mumbai, MH",
    availableFrom: "2026-09-01T14:00",
    availableUntil: "2026-09-02T08:00",
    capacity: "12",
    rate: "38",
    status: "Matched",
  },
];

const emptyForm = {
  vehicleId: "",
  driverId: "",
  origin: "",
  destination: "",
  availableFrom: "",
  availableUntil: "",
  capacity: "",
  rate: "",
  notes: "",
};

function formatWindow(from, until) {
  const opts = { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" };
  const f = new Date(from);
  const u = new Date(until);
  const fmt = (d) => d.toLocaleString("en-IN", opts).replace(",", "");
  return `${fmt(f)} → ${fmt(u)}`;
}

export function TypeBadge({ type }) {
  const meta = TRUCK_TYPES.find((t) => t.value === type) || TRUCK_TYPES[2];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-[#E2E6E8] bg-[#F6F7F8] px-2 py-1 text-[12px] font-medium text-[#14181B]">
      <Icon size={13} strokeWidth={2} />
      {type}
    </span>
  );
}

export default function LoadBoard() {
  const [postings, setPostings] = useState(INITIAL_POSTINGS);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const selectedVehicle = useMemo(
    () => VENDOR_VEHICLES.find((v) => v.id === form.vehicleId),
    [form.vehicleId]
  );

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = () => {
    const req = ["vehicleId", "driverId", "origin", "availableFrom", "availableUntil", "capacity"];
    const next = {};
    req.forEach((k) => {
      if (!form[k]) next[k] = true;
    });
    if (
      form.availableFrom &&
      form.availableUntil &&
      new Date(form.availableUntil) <= new Date(form.availableFrom)
    ) {
      next.availableUntil = true;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const vehicle = VENDOR_VEHICLES.find((v) => v.id === form.vehicleId);
    const driver = VENDOR_DRIVERS.find((d) => d.id === form.driverId);
    const newPosting = {
      id: `p${Date.now()}`,
      vehicleNumber: vehicle.number,
      vehicleType: vehicle.type,
      driverName: driver.name,
      origin: form.origin,
      destination: form.destination || "Open to any",
      availableFrom: form.availableFrom,
      availableUntil: form.availableUntil,
      capacity: form.capacity,
      rate: form.rate,
      status: "Active",
    };
    setPostings((prev) => [newPosting, ...prev]);
    setForm(emptyForm);
    setFormOpen(false);
  };

  const withdraw = (id) =>
    setPostings((prev) => prev.filter((p) => p.id !== id));

  const activeCount = postings.filter((p) => p.status === "Active").length;

  const inputCls = (key) =>
    `w-full rounded-[3px] border bg-white px-3 py-2 text-[13px] text-[#14181B] outline-none transition-colors focus:border-[#0B6E4F] ${
      errors[key] ? "border-[#C2402E]" : "border-[#E2E6E8]"
    }`;

  const labelCls = "mb-1 block text-[12px] font-medium text-[#5B6670]";

  return (
    <div className="w-full bg-white font-sans" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Section header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#E2E6E8] px-6 py-5">
        <div>
          <h2 className="text-[20px] font-semibold text-[#14181B]">Load board</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-5 text-[#5B6670]">
            Post a truck that's sitting idle and Taapmaan will match it to a booking
            automatically. Vehicle and driver come from your onboarded resources.
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-[3px] bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <Plus size={15} strokeWidth={2.5} />
            Post idle truck
          </button>
        )}
      </div>

      {/* Post form */}
      {formOpen && (
        <div className="border-b border-[#E2E6E8] bg-[#F6F7F8] px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#14181B]">Post a new truck</h3>
            <button
              onClick={() => {
                setFormOpen(false);
                setForm(emptyForm);
                setErrors({});
              }}
              className="text-[#5B6670] hover:text-[#14181B]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className={labelCls}>Vehicle *</label>
              <select className={inputCls("vehicleId")} value={form.vehicleId} onChange={setField("vehicleId")}>
                <option value="">Select vehicle</option>
                {VENDOR_VEHICLES.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.number} — {v.type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Driver *</label>
              <select className={inputCls("driverId")} value={form.driverId} onChange={setField("driverId")}>
                <option value="">Select driver</option>
                {VENDOR_DRIVERS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Truck type</label>
              <input
                disabled
                className="w-full rounded-[3px] border border-[#E2E6E8] bg-[#EFF1F2] px-3 py-2 text-[13px] text-[#5B6670]"
                value={selectedVehicle ? selectedVehicle.type : "Auto-filled from vehicle"}
              />
            </div>

            <div>
              <label className={labelCls}>Current / origin location *</label>
              <input
                className={inputCls("origin")}
                placeholder="e.g. Pune, MH"
                value={form.origin}
                onChange={setField("origin")}
              />
            </div>

            <div>
              <label className={labelCls}>Preferred destination</label>
              <input
                className={inputCls("destination")}
                placeholder="Leave blank for open to any"
                value={form.destination}
                onChange={setField("destination")}
              />
            </div>

            <div>
              <label className={labelCls}>Capacity (tons) *</label>
              <input
                type="number"
                min="0"
                className={inputCls("capacity")}
                placeholder="e.g. 9"
                value={form.capacity}
                onChange={setField("capacity")}
              />
            </div>

            <div>
              <label className={labelCls}>Available from *</label>
              <input
                type="datetime-local"
                className={inputCls("availableFrom")}
                value={form.availableFrom}
                onChange={setField("availableFrom")}
              />
            </div>

            <div>
              <label className={labelCls}>Available until *</label>
              <input
                type="datetime-local"
                className={inputCls("availableUntil")}
                value={form.availableUntil}
                onChange={setField("availableUntil")}
              />
              {errors.availableUntil && (
                <p className="mt-1 text-[11px] text-[#C2402E]">Must be after the start time</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Min rate expectation (₹/km)</label>
              <input
                type="number"
                min="0"
                className={inputCls("rate")}
                placeholder="Optional, all-in"
                value={form.rate}
                onChange={setField("rate")}
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelCls}>Notes</label>
              <textarea
                rows={2}
                className={inputCls("notes")}
                placeholder="Anything the admin should know — e.g. reefer serviced, driver break needed after 6pm"
                value={form.notes}
                onChange={setField("notes")}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="rounded-[3px] bg-[#0B6E4F] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#095c42]"
            >
              Post truck
            </button>
            <button
              onClick={() => {
                setFormOpen(false);
                setForm(emptyForm);
                setErrors({});
              }}
              className="rounded-[3px] px-5 py-2.5 text-[13px] font-semibold text-[#5B6670] hover:text-[#14181B]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active postings */}
      <div className="px-6 py-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#5B6670]">
            Your postings ({activeCount} active)
          </h3>
        </div>

        {postings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3px] border border-dashed border-[#E2E6E8] py-16 text-center">
            <Truck size={28} className="mb-3 text-[#8A9299]" strokeWidth={1.5} />
            <p className="text-[14px] font-medium text-[#14181B]">No trucks posted yet</p>
            <p className="mt-1 max-w-xs text-[13px] text-[#5B6670]">
              Post an idle truck and it stays visible to the Taapmaan admin until it's
              matched or the availability window ends.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[3px] border border-[#E2E6E8]">
            <div className="grid grid-cols-[1.3fr_1fr_1.6fr_1.8fr_0.9fr_0.9fr_40px] gap-3 border-b border-[#E2E6E8] bg-[#F6F7F8] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#5B6670]">
              <div>Vehicle / driver</div>
              <div>Type</div>
              <div>Route</div>
              <div>Available window</div>
              <div>Rate</div>
              <div>Status</div>
              <div />
            </div>
            {postings.map((p) => {
              const s = STATUS_STYLES[p.status];
              return (
                <div
                  key={p.id}
                  className="grid grid-cols-[1.3fr_1fr_1.6fr_1.8fr_0.9fr_0.9fr_40px] items-center gap-3 border-b border-[#E2E6E8] px-4 py-3 text-[13px] text-[#14181B] last:border-b-0 hover:bg-[#FAFBFB]"
                >
                  <div>
                    <div className="font-medium">{p.vehicleNumber}</div>
                    <div className="text-[12px] text-[#5B6670]">{p.driverName}</div>
                  </div>
                  <div>
                    <VehicleTypeBadge type={p.vehicleType} />
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#14181B]">
                    <MapPin size={13} className="shrink-0 text-[#8A9299]" />
                    <span className="truncate">
                      {p.origin} <ChevronRight size={11} className="mx-0.5 inline text-[#8A9299]" /> {p.destination}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-[#14181B]">
                    <Calendar size={13} className="shrink-0 text-[#8A9299]" />
                    <span>{formatWindow(p.availableFrom, p.availableUntil)}</span>
                  </div>
                  <div className="text-[13px] tabular-nums">
                    {p.rate ? `₹${p.rate}/km` : "—"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                    <span className={`text-[12px] font-medium ${s.text}`}>{p.status}</span>
                  </div>
                  <div>
                    {p.status === "Active" && (
                      <button
                        onClick={() => withdraw(p.id)}
                        className="text-[#8A9299] hover:text-[#C2402E]"
                        title="Withdraw posting"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}