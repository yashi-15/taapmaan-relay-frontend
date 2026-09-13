import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockVehiclesList, generateMockVehicleId } from "../../utils/vehicleslistMock";
import type {
    CreateVehiclePayload,
    VehicleRecord,
} from "../types/vehiclePayload";
import { TripStatusBadge, DocBadge, StatusBadge } from "../elements/VehicleBadges";

type DocumentKey =
    | "rcUrl"
    | "rcExpiryDate"
    | "insuranceUrl"
    | "insuranceExpiryDate"
    | "permitUrl"
    | "permitExpiryDate"
    | "puccUrl"
    | "puccExpiryDate"
    | "fitnessCertificateUrl"
    | "fitnessExpiryDate";

const EMPTY_FORM: CreateVehiclePayload = {
    registrationNumber: "",
    vehicleSize: "",
    capacityTon: 0,
    hasTemperatureControl: false,
    make: "",
    model: "",
    documents: {
        rcUrl: "",
        rcExpiryDate: "",
        insuranceUrl: "",
        insuranceExpiryDate: "",
        permitUrl: "",
        permitExpiryDate: "",
        puccUrl: "",
        puccExpiryDate: "",
        fitnessCertificateUrl: "",
        fitnessExpiryDate: "",
    },
};

const DOCUMENT_FIELDS: { urlKey: DocumentKey; dateKey: DocumentKey; label: string; required?: boolean }[] = [
    { urlKey: "rcUrl", dateKey: "rcExpiryDate", label: "Registration Certificate", required: true },
    { urlKey: "insuranceUrl", dateKey: "insuranceExpiryDate", label: "Insurance" },
    { urlKey: "permitUrl", dateKey: "permitExpiryDate", label: "Permit" },
    { urlKey: "puccUrl", dateKey: "puccExpiryDate", label: "PUCC" },
    { urlKey: "fitnessCertificateUrl", dateKey: "fitnessExpiryDate", label: "Fitness Certificate" },
];

const inputBoxClass =
    "border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary";
const inputFieldClass = "w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1";
const labelClass = "block text-xs font-semibold text-zinc-500 uppercase tracking-wide";

function Field({
    label,
    required,
    error,
    children,
}: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className={inputBoxClass}>
                <label className={labelClass}>
                    {label}
                    {required && <span className="text-red-500"> *</span>}
                </label>
                {children}
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

const Vehicles: React.FC = () => {
    const navigate = useNavigate();

    // Fleet data now comes entirely from the local mock — no fetch, no
    // loading/error states needed since nothing can fail.
    const [vehicles, setVehicles] = useState<VehicleRecord[]>(mockVehiclesList);

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<CreateVehiclePayload>(EMPTY_FORM);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const updateField = <K extends keyof CreateVehiclePayload>(key: K, value: CreateVehiclePayload[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const updateDocument = (key: DocumentKey, value: string) => {
        setForm((prev) => ({ ...prev, documents: { ...prev.documents, [key]: value } }));
    };

    const resetForm = () => {
        setForm(EMPTY_FORM);
        setFieldErrors({});
    };

    // Purely local "create" — builds a fake VehicleRecord and prepends it to
    // the in-memory list. Nothing is sent anywhere, and the list resets to
    // the mock data on page reload since it isn't persisted.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatusMessage(null);
        setFieldErrors({});

        if (!form.documents.rcUrl.trim()) {
            setFieldErrors({ rcUrl: "RC document URL is required" });
            return;
        }

        setIsSaving(true);

        // Simulate a brief save delay so the spinner still makes sense.
        await new Promise((resolve) => setTimeout(resolve, 400));

        const documents = Object.fromEntries(
            Object.entries(form.documents).filter(([, v]) => v !== "")
        ) as CreateVehiclePayload["documents"];

        const now = new Date().toISOString();
        const newVehicle: VehicleRecord = {
            ...form,
            documents,
            id: generateMockVehicleId(),
            vendorId: "vendor_mock_1",
            status: "ACTIVE",
            createdAt: now,
            updatedAt: now,
        };

        setVehicles((prev) => [newVehicle, ...prev]);
        resetForm();
        setShowForm(false);
        setIsSaving(false);
        setStatusMessage({ type: "success", text: "Vehicle added successfully!" });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    return (
        <div className="py-1 sm:py-3 flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center items-stretch justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">Vehicles</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">Manage your fleet and keep vehicle documents up to date.</p>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        resetForm();
                        setStatusMessage(null);
                        setShowForm((s) => !s);
                    }}
                    className="self-start sm:self-auto py-2 px-4 text-sm font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm transition-all transform active:scale-95"
                >
                    {showForm ? "Cancel" : "Add Vehicle"}
                </button>
            </div>

            {/* Status alerts */}
            {statusMessage && (
                <div
                    className={`p-3 rounded-xl border text-sm flex items-center gap-2 animate-in fade-in duration-200 ${statusMessage.type === "success"
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}
                >
                    <span className="text-base">{statusMessage.type === "success" ? "✅" : "⚠️"}</span>
                    <span className="font-medium">{statusMessage.text}</span>
                </div>
            )}

            {showForm && (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-slate-200">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-3">Vehicle Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Registration Number" required>
                                <input
                                    type="text"
                                    value={form.registrationNumber}
                                    placeholder="DL01AB1234"
                                    onChange={(e) => updateField("registrationNumber", e.target.value.toUpperCase())}
                                    className={inputFieldClass}
                                />
                            </Field>
                            <Field label="Vehicle Size" required>
                                <input
                                    type="text"
                                    value={form.vehicleSize}
                                    placeholder="FT_8"
                                    onChange={(e) => updateField("vehicleSize", e.target.value)}
                                    className={inputFieldClass}
                                />
                            </Field>
                            <Field label="Capacity (Tons)" required>
                                <input
                                    type="number"
                                    min={0}
                                    step="0.1"
                                    value={form.capacityTon}
                                    onChange={(e) => updateField("capacityTon", Number(e.target.value))}
                                    className={inputFieldClass}
                                />
                            </Field>
                            <Field label="Make" required>
                                <input
                                    type="text"
                                    value={form.make}
                                    placeholder="Tata"
                                    onChange={(e) => updateField("make", e.target.value)}
                                    className={inputFieldClass}
                                />
                            </Field>
                            <Field label="Model" required>
                                <input
                                    type="text"
                                    value={form.model}
                                    placeholder="LPT 1109"
                                    onChange={(e) => updateField("model", e.target.value)}
                                    className={inputFieldClass}
                                />
                            </Field>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={form.hasTemperatureControl}
                                    onChange={(e) => updateField("hasTemperatureControl", e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 accent-primary"
                                />
                                <span className="text-sm text-zinc-700 font-medium">Has temperature control</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-1">Documents</h3>
                        <p className="text-xs text-zinc-500 mb-3">
                            Only the Registration Certificate is required to onboard a vehicle.
                        </p>
                        <div className="flex flex-col gap-4">
                            {DOCUMENT_FIELDS.map(({ urlKey, dateKey, label, required }) => (
                                <div key={urlKey} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2">
                                        <Field label={`${label} URL`} required={required} error={fieldErrors[urlKey]}>
                                            <input
                                                type="text"
                                                value={form.documents[urlKey] ?? ""}
                                                placeholder="https://storage.example.com/..."
                                                onChange={(e) => updateDocument(urlKey, e.target.value)}
                                                className={inputFieldClass}
                                            />
                                        </Field>
                                    </div>
                                    <Field label="Expiry Date">
                                        <input
                                            type="date"
                                            value={(form.documents[dateKey] ?? "").slice(0, 10)}
                                            onChange={(e) => updateDocument(dateKey, e.target.value)}
                                            className={inputFieldClass}
                                        />
                                    </Field>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="py-2.5 px-6 font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Adding Vehicle...</span>
                                </>
                            ) : (
                                "Add Vehicle"
                            )}
                        </button>
                    </div>
                </form>
            )}

            {vehicles.length === 0 ? (
                <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 text-center">
                    <p className="text-sm text-zinc-500">No vehicles added yet.</p>
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="mt-2 text-sm font-semibold text-primary hover:underline"
                    >
                        Add your first vehicle
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto">
                <div className="min-w-[900px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50/70 text-zinc-600">
                                <th className="text-left py-3 px-4 font-semibold">Registration</th>
                                <th className="text-left py-3 px-4 font-semibold">Vehicle</th>
                                <th className="text-left py-3 px-4 font-semibold">Capacity</th>
                                <th className="text-left py-3 px-4 font-semibold">Trip Status</th>
                                <th className="text-left py-3 px-4 font-semibold">Documents</th>
                                <th className="text-left py-3 px-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-zinc-800">
                            {vehicles.map((v) => (
                                <tr
                                    key={v.id}
                                    onClick={() => navigate(`/dashboard/vehicles/${v.id}`, { state: { vehicle: v } })}
                                    className="hover:bg-slate-50/50 transition-colors align-top cursor-pointer"
                                >                                    <td className="py-3 px-4 font-medium whitespace-nowrap">{v.registrationNumber}</td>
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{v.make} {v.model}</div>
                                        <div className="text-xs text-zinc-500">
                                            {v.vehicleSize}{v.hasTemperatureControl ? " · Temp control" : ""}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">{v.capacityTon}T</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <TripStatusBadge vehicleId={v.id} />
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                                            {DOCUMENT_FIELDS.map(({ urlKey, dateKey, label }) =>
                                                v.documents[urlKey] ? (
                                                    <DocBadge key={urlKey} label={label} dateStr={v.documents[dateKey]} />
                                                ) : null
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <StatusBadge status={v.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </div>
            )}
        </div>
    );
};

export default Vehicles;