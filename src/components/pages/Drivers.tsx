import { useMemo, useState, type ChangeEvent } from "react";
import {
  Plus,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  UserRound,
  X,
  Trash2,
  Eye,
} from "lucide-react";
import {
  DRIVERS_MOCK,
  type Driver,
  type DriverAvailabilityStatus,
  type DriverVerificationStatus,
} from "../../utils/driversMock";

// ---------------------------------------------------------------------------
// Status presentation — mirrors DriverAvailabilityStatus / DriverVerificationStatus
// on the `Driver` Prisma model.
// ---------------------------------------------------------------------------
const AVAILABILITY_STYLES: Record<DriverAvailabilityStatus, { dot: string; text: string; label: string }> = {
  available: { dot: "bg-[#0B6E4F]", text: "text-[#0B6E4F]", label: "Available" },
  on_trip: { dot: "bg-[#B4690E]", text: "text-[#B4690E]", label: "On trip" },
  unavailable: { dot: "bg-[#8A9299]", text: "text-[#8A9299]", label: "Unavailable" },
};

const VERIFICATION_STYLES: Record<DriverVerificationStatus, { icon: typeof ShieldCheck; text: string; bg: string; label: string }> = {
  verified: { icon: ShieldCheck, text: "text-[#0B6E4F]", bg: "bg-[#EAF5F0]", label: "Verified" },
  pending: { icon: ShieldQuestion, text: "text-[#B4690E]", bg: "bg-[#FBF1E6]", label: "Pending review" },
  rejected: { icon: ShieldAlert, text: "text-[#C2402E]", bg: "bg-[#FBEBE8]", label: "Rejected" },
};

interface DriverForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  licenseNumber: string;
  dateOfBirth: string;
  joiningDate: string;
  address: string;
  emergencyContact: string;
}

type FormErrors = Partial<Record<keyof DriverForm, boolean>>;

const emptyForm: DriverForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  licenseNumber: "",
  dateOfBirth: "",
  joiningDate: "",
  address: "",
  emergencyContact: "",
};

function initials(firstName: string, lastName: string): string {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function VerificationBadge({ status }: { status: DriverVerificationStatus }) {
  const meta = VERIFICATION_STYLES[status] || VERIFICATION_STYLES.pending;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-[3px] px-2 py-1 text-[12px] font-medium ${meta.bg} ${meta.text}`}>
      <Icon size={13} strokeWidth={2} />
      {meta.label}
    </span>
  );
}

function AvailabilityDot({ status }: { status: DriverAvailabilityStatus }) {
  const meta = AVAILABILITY_STYLES[status] || AVAILABILITY_STYLES.unavailable;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      <span className={`text-[12px] font-medium ${meta.text}`}>{meta.label}</span>
    </span>
  );
}

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(DRIVERS_MOCK);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<DriverForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  const selectedDriver = useMemo(
    () => drivers.find((d) => d.id === selectedDriverId) || null,
    [drivers, selectedDriverId]
  );

  const verifiedCount = drivers.filter((d) => d.verificationStatus === "verified").length;

  const setField = (key: keyof DriverForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.firstName.trim()) next.firstName = true;
    if (!form.lastName.trim()) next.lastName = true;
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = true;
    if (!form.licenseNumber.trim()) next.licenseNumber = true;
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newDriver: Driver = {
      id: `d${Date.now()}`,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      licenseNumber: form.licenseNumber.trim().toUpperCase(),
      emergencyContact: form.emergencyContact.trim() || null,
      dateOfBirth: form.dateOfBirth || null,
      joiningDate: form.joiningDate || null,
      address: form.address.trim() || null,
      profilePhotoUrl: null,
      availabilityStatus: "available",
      verificationStatus: "pending",
      rejectionReason: null,
      createdAt: new Date().toISOString(),
    };
    setDrivers((prev) => [newDriver, ...prev]);
    setForm(emptyForm);
    setFormOpen(false);
  };

  const removeDriver = (id: string) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
    if (selectedDriverId === id) setSelectedDriverId(null);
  };

  const inputCls = (key: keyof DriverForm) =>
    `w-full rounded-[3px] border bg-white px-3 py-2 text-[13px] text-[#14181B] outline-none transition-colors focus:border-[#0B6E4F] ${
      errors[key] ? "border-[#C2402E]" : "border-[#E2E6E8]"
    }`;

  const labelCls = "mb-1 block text-[12px] font-medium text-[#5B6670]";

  return (
    <div className="relative w-full bg-white font-sans" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Section header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#E2E6E8] px-6 py-5">
        <div>
          <h2 className="text-[20px] font-semibold text-[#14181B]">Drivers</h2>
          <p className="mt-1 max-w-xl text-[13px] leading-5 text-[#5B6670]">
            Onboard your drivers so you can assign them to trips and vehicles. New
            drivers stay in pending review until Taapmaan verifies their license.
          </p>
        </div>
        {!formOpen && (
          <button
            onClick={() => setFormOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-[3px] bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-primary/90"
          >
            <Plus size={15} strokeWidth={2.5} />
            Onboard driver
          </button>
        )}
      </div>

      {/* Onboarding form */}
      {formOpen && (
        <div className="border-b border-[#E2E6E8] bg-[#F6F7F8] px-6 py-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[#14181B]">Onboard a new driver</h3>
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
              <label className={labelCls}>First name *</label>
              <input
                className={inputCls("firstName")}
                placeholder="e.g. Ramesh"
                value={form.firstName}
                onChange={setField("firstName")}
              />
            </div>

            <div>
              <label className={labelCls}>Last name *</label>
              <input
                className={inputCls("lastName")}
                placeholder="e.g. Yadav"
                value={form.lastName}
                onChange={setField("lastName")}
              />
            </div>

            <div>
              <label className={labelCls}>Phone *</label>
              <input
                className={inputCls("phone")}
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={setField("phone")}
              />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-[#C2402E]">Enter a valid 10-digit phone number</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Email</label>
              <input
                className={inputCls("email")}
                placeholder="Optional"
                value={form.email}
                onChange={setField("email")}
              />
              {errors.email && (
                <p className="mt-1 text-[11px] text-[#C2402E]">Enter a valid email address</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Driving license number *</label>
              <input
                className={inputCls("licenseNumber")}
                placeholder="e.g. MH1420190012345"
                value={form.licenseNumber}
                onChange={setField("licenseNumber")}
              />
            </div>

            <div>
              <label className={labelCls}>Emergency contact</label>
              <input
                className={inputCls("emergencyContact")}
                placeholder="Optional"
                value={form.emergencyContact}
                onChange={setField("emergencyContact")}
              />
            </div>

            <div>
              <label className={labelCls}>Date of birth</label>
              <input
                type="date"
                className={inputCls("dateOfBirth")}
                value={form.dateOfBirth}
                onChange={setField("dateOfBirth")}
              />
            </div>

            <div>
              <label className={labelCls}>Joining date</label>
              <input
                type="date"
                className={inputCls("joiningDate")}
                value={form.joiningDate}
                onChange={setField("joiningDate")}
              />
            </div>

            <div>
              <label className={labelCls}>Profile photo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full rounded-[3px] border border-[#E2E6E8] bg-white px-3 py-1.5 text-[13px] text-[#5B6670] file:mr-3 file:rounded-[3px] file:border-0 file:bg-[#F6F7F8] file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-[#14181B]"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className={labelCls}>Address</label>
              <textarea
                rows={2}
                className={inputCls("address")}
                placeholder="Driver's residential address"
                value={form.address}
                onChange={setField("address")}
              />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="rounded-[3px] bg-[#0B6E4F] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#095c42]"
            >
              Onboard driver
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

      {/* Drivers list */}
      <div className="px-6 py-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-[#5B6670]">
            Your drivers ({verifiedCount} verified)
          </h3>
        </div>

        {drivers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[3px] border border-dashed border-[#E2E6E8] py-16 text-center">
            <UserRound size={28} className="mb-3 text-[#8A9299]" strokeWidth={1.5} />
            <p className="text-[14px] font-medium text-[#14181B]">No drivers onboarded yet</p>
            <p className="mt-1 max-w-xs text-[13px] text-[#5B6670]">
              Onboard a driver to assign them to trips and vehicles. They'll stay in
              pending review until Taapmaan verifies their license.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[3px] border border-[#E2E6E8]">
            <div className="grid grid-cols-[1.6fr_1.3fr_1.3fr_1fr_1.2fr_1.2fr_70px] gap-3 border-b border-[#E2E6E8] bg-[#F6F7F8] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#5B6670]">
              <div>Driver</div>
              <div>License</div>
              <div>Contact</div>
              <div>Joined</div>
              <div>Availability</div>
              <div>Verification</div>
              <div />
            </div>
            {drivers.map((d) => (
              <div
                key={d.id}
                className="grid grid-cols-[1.6fr_1.3fr_1.3fr_1fr_1.2fr_1.2fr_70px] items-center gap-3 border-b border-[#E2E6E8] px-4 py-3 text-[13px] text-[#14181B] last:border-b-0 hover:bg-[#FAFBFB]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F6F7F8] text-[11px] font-semibold text-[#5B6670]">
                    {initials(d.firstName, d.lastName)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {d.firstName} {d.lastName}
                    </div>
                    <div className="text-[12px] text-[#5B6670]">{d.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#14181B]">
                  <CreditCard size={13} className="shrink-0 text-[#8A9299]" />
                  <span className="truncate">{d.licenseNumber}</span>
                </div>
                <div className="min-w-0 text-[12px] text-[#14181B]">
                  {d.email ? (
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="shrink-0 text-[#8A9299]" />
                      <span className="truncate">{d.email}</span>
                    </div>
                  ) : (
                    <span className="text-[#8A9299]">—</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-[#14181B]">
                  <Calendar size={13} className="shrink-0 text-[#8A9299]" />
                  <span>{formatDate(d.joiningDate)}</span>
                </div>
                <div>
                  <AvailabilityDot status={d.availabilityStatus} />
                </div>
                <div>
                  <VerificationBadge status={d.verificationStatus} />
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedDriverId(d.id)}
                    className="text-[#8A9299] hover:text-[#14181B]"
                    title="View driver"
                  >
                    <Eye size={15} />
                  </button>
                  {d.verificationStatus !== "verified" && (
                    <button
                      onClick={() => removeDriver(d.id)}
                      className="text-[#8A9299] hover:text-[#C2402E]"
                      title="Remove driver"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail drawer */}
      {selectedDriver && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setSelectedDriverId(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E6E8] px-6 py-4">
              <h3 className="text-[14px] font-semibold text-[#14181B]">Driver details</h3>
              <button
                onClick={() => setSelectedDriverId(null)}
                className="text-[#5B6670] hover:text-[#14181B]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center gap-3 border-b border-[#E2E6E8] pb-5">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F6F7F8] text-[16px] font-semibold text-[#5B6670]">
                  {initials(selectedDriver.firstName, selectedDriver.lastName)}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-semibold text-[#14181B]">
                    {selectedDriver.firstName} {selectedDriver.lastName}
                  </div>
                  <div className="mt-1">
                    <VerificationBadge status={selectedDriver.verificationStatus} />
                  </div>
                </div>
              </div>

              {selectedDriver.verificationStatus === "rejected" && selectedDriver.rejectionReason && (
                <div className="mt-4 rounded-[3px] bg-[#FBEBE8] px-3 py-2.5 text-[12px] leading-5 text-[#C2402E]">
                  {selectedDriver.rejectionReason}
                </div>
              )}

              <dl className="mt-5 space-y-4">
                <div className="flex items-start gap-2.5">
                  <Phone size={14} className="mt-0.5 shrink-0 text-[#8A9299]" />
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8A9299]">Phone</dt>
                    <dd className="text-[13px] text-[#14181B]">{selectedDriver.phone}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail size={14} className="mt-0.5 shrink-0 text-[#8A9299]" />
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8A9299]">Email</dt>
                    <dd className="text-[13px] text-[#14181B]">{selectedDriver.email || "—"}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CreditCard size={14} className="mt-0.5 shrink-0 text-[#8A9299]" />
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8A9299]">License number</dt>
                    <dd className="text-[13px] text-[#14181B]">{selectedDriver.licenseNumber}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone size={14} className="mt-0.5 shrink-0 text-[#8A9299]" />
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8A9299]">Emergency contact</dt>
                    <dd className="text-[13px] text-[#14181B]">{selectedDriver.emergencyContact || "—"}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar size={14} className="mt-0.5 shrink-0 text-[#8A9299]" />
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8A9299]">Date of birth</dt>
                    <dd className="text-[13px] text-[#14181B]">{formatDate(selectedDriver.dateOfBirth)}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar size={14} className="mt-0.5 shrink-0 text-[#8A9299]" />
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8A9299]">Joining date</dt>
                    <dd className="text-[13px] text-[#14181B]">{formatDate(selectedDriver.joiningDate)}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-[#8A9299]" />
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8A9299]">Address</dt>
                    <dd className="text-[13px] leading-5 text-[#14181B]">{selectedDriver.address || "—"}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <UserRound size={14} className="mt-0.5 shrink-0 text-[#8A9299]" />
                  <div>
                    <dt className="text-[11px] font-medium uppercase tracking-wide text-[#8A9299]">Availability</dt>
                    <dd className="text-[13px] text-[#14181B]">
                      <AvailabilityDot status={selectedDriver.availabilityStatus} />
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </>
      )}
    </div>
  );
}