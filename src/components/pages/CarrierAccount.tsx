import React, { useState } from "react";
import { mockVendorData } from "../../utils/vendorMock";
import type { CreateVendorPayload, VendorRecord } from "../types/vendorPayload";

type FormOverrides = Partial<{
    companyName: string;
    carrierIdentifier: string;
    email: string;
    countryCode: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}>;

const CarrierAccount: React.FC = () => {
    const [tab, setTab] = useState("company-info");

    // All vendor data now comes from the local mock — no backend fetch.
    const [vendor, setVendor] = useState<VendorRecord>(mockVendorData);
    const [formOverrides, setFormOverrides] = useState<FormOverrides>({});
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const formData = {
        companyName: formOverrides.companyName ?? vendor.companyName ?? "",
        carrierIdentifier: formOverrides.carrierIdentifier ?? vendor.carrierIdentifier ?? "",
        email: formOverrides.email ?? vendor.email ?? "",
        countryCode: formOverrides.countryCode ?? vendor.countryCode ?? "+91",
        phoneNumber: formOverrides.phoneNumber ?? vendor.phoneNumber ?? "",
        addressLine1: formOverrides.addressLine1 ?? vendor.addressLine1 ?? "",
        addressLine2: formOverrides.addressLine2 ?? vendor.addressLine2 ?? "",
        city: formOverrides.city ?? vendor.city ?? "",
        state: formOverrides.state ?? vendor.state ?? "",
        pincode: formOverrides.pincode ?? vendor.pincode ?? "",
        country: formOverrides.country ?? vendor.country ?? "India",
        domiciles: vendor.domiciles ?? [],
        documents: vendor.documents,
        bankDetails: vendor.bankDetails,
        status: vendor.status,
    };

    const handleInputChange = (field: keyof FormOverrides, value: string) => {
        setFormOverrides((prev) => ({ ...prev, [field]: value }));
    };

    // Purely local "save" — merges the edited fields into the in-memory
    // vendor record. Nothing is sent anywhere, and it resets on page reload
    // since it's not persisted to localStorage.
    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMessage(null);

        const payload: Partial<CreateVendorPayload> = {
            companyName: formData.companyName,
            carrierIdentifier: formData.carrierIdentifier,
            email: formData.email,
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
        };

        // Simulate a brief save delay so the spinner still makes sense.
        await new Promise((resolve) => setTimeout(resolve, 400));

        setVendor((prev) => ({ ...prev, ...payload }));
        setFormOverrides({});
        setIsSaving(false);
        setStatusMessage({ type: "success", text: "Vendor details updated successfully!" });
        setTimeout(() => setStatusMessage(null), 4000);
    };

    return (
        <div className="py-1 sm:py-3 flex flex-col gap-4">
            <div className="flex gap-5 border-b border-slate-200 overflow-x-auto no-scrollbar">
                <button type="button" onClick={() => setTab("company-info")}
                    className={`shrink-0 whitespace-nowrap min-w-[110px] sm:w-32 pb-2 text-sm font-medium transition-colors ${tab === "company-info" ? "border-b-2 border-primary text-primary font-semibold" : "text-zinc-500 hover:text-zinc-800"}`}>
                    Company Info
                </button>
                <button type="button" onClick={() => setTab("documents")}
                    className={`shrink-0 whitespace-nowrap min-w-[110px] sm:w-32 pb-2 text-sm font-medium transition-colors ${tab === "documents" ? "border-b-2 border-primary text-primary font-semibold" : "text-zinc-500 hover:text-zinc-800"}`}>
                    Documents
                </button>
                <button type="button" onClick={() => setTab("payment-info")}
                    className={`shrink-0 whitespace-nowrap min-w-[110px] sm:w-32 pb-2 text-sm font-medium transition-colors ${tab === "payment-info" ? "border-b-2 border-primary text-primary font-semibold" : "text-zinc-500 hover:text-zinc-800"}`}>
                    Payment Info
                </button>
                <button type="button" onClick={() => setTab("site-user")}
                    className={`shrink-0 whitespace-nowrap min-w-[110px] sm:w-32 pb-2 text-sm font-medium transition-colors ${tab === "site-user" ? "border-b-2 border-primary text-primary font-semibold" : "text-zinc-500 hover:text-zinc-800"}`}>
                    Site User
                </button>
            </div>

            {statusMessage && (
                <div className={`p-3 rounded-xl border text-sm flex items-center gap-2 animate-in fade-in duration-200 ${statusMessage.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"}`}>
                    <span className="text-base">{statusMessage.type === "success" ? "✅" : "⚠️"}</span>
                    <span className="font-medium">{statusMessage.text}</span>
                </div>
            )}

            {tab === "company-info" && (
                <form onSubmit={handleSaveChanges} className="flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-3">Authority Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Company Name</label>
                                <input type="text" value={formData.companyName} onChange={(e) => handleInputChange("companyName", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Carrier Identifier</label>
                                <input type="text" value={formData.carrierIdentifier} onChange={(e) => handleInputChange("carrierIdentifier", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-1">Email & Phone number</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                            <div className="sm:col-span-2 md:col-span-4 border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Email Address</label>
                                <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Country Code</label>
                                <input type="text" value={formData.countryCode} onChange={(e) => handleInputChange("countryCode", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Phone Number</label>
                                <input type="text" value={formData.phoneNumber} onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-3">Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="sm:col-span-2 border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Address Line 1</label>
                                <input type="text" value={formData.addressLine1} onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                            <div className="sm:col-span-2 border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Address Line 2</label>
                                <input type="text" value={formData.addressLine2} onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">City</label>
                                <input type="text" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">State</label>
                                <input type="text" value={formData.state} onChange={(e) => handleInputChange("state", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">PIN Code</label>
                                <input type="text" value={formData.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Country</label>
                                <input type="text" value={formData.country} onChange={(e) => handleInputChange("country", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1" />
                            </div>
                        </div>
                    </div>

                    {/* Domicile(s) — read from the mock data */}
                    <div>
                        <h3 className="text-lg font-semibold text-zinc-900 mb-3">Domicile(s)</h3>
                        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/70 text-zinc-600">
                                        <th className="text-left py-3 px-4 font-semibold">Domicile</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-zinc-800">
                                    {formData.domiciles.length > 0 ? (
                                        formData.domiciles.map((domicile) => (
                                            <tr key={domicile} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 px-4 font-medium">{domicile}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td className="py-3 px-4 text-zinc-500">No domiciles on file.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={isSaving}
                            className="py-2.5 px-6 font-semibold bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            )}

            {tab === "documents" && (
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Documents</h3>
                    {formData.documents ? (
                        <div className="flex flex-col gap-2 text-sm text-zinc-700">
                            <p><span className="font-semibold">GSTIN:</span> {formData.documents.gstin}</p>
                            <p><span className="font-semibold">PAN Card:</span> {formData.documents.panCard}</p>
                            {formData.documents.carrierAgreementUrl && (
                                <p><a href={formData.documents.carrierAgreementUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Carrier Agreement</a></p>
                            )}
                            {formData.documents.programmePolicyUrl && (
                                <p><a href={formData.documents.programmePolicyUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Programme Policy</a></p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500">No documents on file.</p>
                    )}
                </div>
            )}

            {tab === "payment-info" && (
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-primary mb-2">Payment Info</h3>
                    {formData.bankDetails ? (
                        <div>
                            <h4 className="text-2xl font-semibold text-zinc-800 mb-1 mt-4">{formData.bankDetails.accountHolderName}</h4>
                            <h4 className="text-lg font-semibold text-zinc-800 mb-1 mt-4"><span className="font-normal">Account number:</span> {formData.bankDetails.bankAccountNumber}</h4>
                            <h4 className="text-lg font-semibold text-zinc-800 mb-1 mt-4"><span className="font-normal">Bank name:</span> {formData.bankDetails.bankName}</h4>
                            <h4 className="text-lg font-semibold text-zinc-800 mb-1 mt-4"><span className="font-normal">IFSC code:</span> {formData.bankDetails.ifscCode}</h4>
                        </div>
                    ) : (
                        <p className="text-sm text-zinc-500">No bank details on file.</p>
                    )}
                </div>
            )}

            {tab === "site-user" && (
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">Site Users</h3>
                    <p className="text-sm text-zinc-500">Manage administrators and team access.</p>
                </div>
            )}
        </div>
    );
};

export default CarrierAccount;