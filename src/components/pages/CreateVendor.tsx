import React, { useState } from "react";
import axios from "axios";
import logo from "../../assets/logo.png";
import authAPI from "../../api/vendor.api";
import type { CreateVendorPayload, CreateVendorResponse, OnboardingSource } from "../types/vendorPayload";
import { useNavigate } from "react-router-dom";

const AVAILABLE_DOMICILES = ["Mumbai", "Pune", "Nashik", "Delhi NCR", "Bengaluru", "Chennai"];

interface CreateVendorFormState {
    name: string;
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
    domiciles: string[];
    onboardingSource: OnboardingSource;
    documents: {
        gstin: string;
        panCard: string;
        carrierAgreementUrl: string;
        programmePolicyUrl: string;
    };
    bankDetails: {
        bankName: string;
        accountHolderName: string;
        ifscCode: string;
        bankAccountNumber: string;
    };
}

const initialFormState: CreateVendorFormState = {
    name: "",
    companyName: "",
    carrierIdentifier: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    domiciles: [],
    onboardingSource: "SELF_ONBOARDED",
    documents: { gstin: "", panCard: "", carrierAgreementUrl: "", programmePolicyUrl: "" },
    bankDetails: { bankName: "", accountHolderName: "", ifscCode: "", bankAccountNumber: "" },
};

type StatusMessage = { type: "success" | "error"; text: string } | null;

const CreateVendor = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<CreateVendorFormState>(initialFormState);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (field: keyof CreateVendorFormState, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleDocumentsChange = (field: keyof CreateVendorFormState["documents"], value: string) => {
        setFormData((prev) => ({ ...prev, documents: { ...prev.documents, [field]: value } }));
    };

    const handleBankDetailsChange = (field: keyof CreateVendorFormState["bankDetails"], value: string) => {
        setFormData((prev) => ({ ...prev, bankDetails: { ...prev.bankDetails, [field]: value } }));
    };

    const handleDomicileToggle = (domicile: string) => {
        setFormData((prev) => ({
            ...prev,
            domiciles: prev.domiciles.includes(domicile)
                ? prev.domiciles.filter((d) => d !== domicile)
                : [...prev.domiciles, domicile],
        }));
    };

    const validate = (): Record<string, string> => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = "Full name is required";
        if (!formData.companyName.trim()) errors.companyName = "Company name is required";
        if (!formData.email.trim()) errors.email = "Email is required";
        if (!formData.phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
        if (!formData.addressLine1.trim()) errors.addressLine1 = "Address line 1 is required";
        if (!formData.city.trim()) errors.city = "City is required";
        if (!formData.state.trim()) errors.state = "State is required";
        if (!formData.pincode.trim()) errors.pincode = "PIN code is required";
        if (formData.domiciles.length === 0) errors.domiciles = "Select at least one domicile";
        if (!formData.documents.gstin.trim()) errors.gstin = "GSTIN is required";
        if (!formData.documents.panCard.trim()) errors.panCard = "PAN card is required";
        if (!formData.bankDetails.bankName.trim()) errors.bankName = "Bank name is required";
        if (!formData.bankDetails.accountHolderName.trim()) errors.accountHolderName = "Account holder name is required";
        if (!formData.bankDetails.ifscCode.trim()) errors.ifscCode = "IFSC code is required";
        if (!formData.bankDetails.bankAccountNumber.trim()) errors.bankAccountNumber = "Account number is required";
        return errors;
    };

    const handleCreateVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});
        setStatusMessage(null);
        setIsSaving(true);

        const payload: CreateVendorPayload = {
            name: formData.name,
            companyName: formData.companyName,
            carrierIdentifier: formData.carrierIdentifier || undefined,
            email: formData.email,
            password: "TaapmaanVendor",
            countryCode: formData.countryCode,
            phoneNumber: formData.phoneNumber,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2 || undefined,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country || undefined,
            domiciles: formData.domiciles,
            onboardingSource: formData.onboardingSource,
            documents: {
                gstin: formData.documents.gstin,
                panCard: formData.documents.panCard,
                carrierAgreementUrl: formData.documents.carrierAgreementUrl || undefined,
                programmePolicyUrl: formData.documents.programmePolicyUrl || undefined,
            },
            bankDetails: formData.bankDetails,
        };

        try {
            const response = await authAPI.create(payload);
            setStatusMessage({ type: "success", text: response.data.message || "Vendor created successfully." });
            setFormData(initialFormState);
            navigate("/login");
        } catch (error) {
            if (axios.isAxiosError<CreateVendorResponse>(error) && error.response?.data) {
                const data = error.response.data;
                if (data.errors?.length) {
                    const errs: Record<string, string> = {};
                    data.errors.forEach((fe) => { errs[fe.field] = fe.message; });
                    setFieldErrors(errs);
                }
                setStatusMessage({ type: "error", text: data.message || data.error || "Failed to create vendor." });
            } else {
                setStatusMessage({ type: "error", text: "Something went wrong. Please try again." });
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen justify-center bg-light">
            <div className="p-6">
                <img src={logo} alt="Taapmaan Logo" width="90px" />
            </div>
            <div className="flex flex-col justify-center items-center px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-2">Create Vendor</h1>
                    <p className="text-sm sm:text-base text-zinc-500">
                        Create a new vendor account by filling in the details below.
                    </p>
                </div>
                <div className="py-1 sm:py-3 flex flex-col gap-4 w-full max-w-4xl">
                    {statusMessage && (
                        <div
                            className={`p-3 rounded-xl border text-sm flex items-center gap-2 animate-in fade-in duration-200 ${
                                statusMessage.type === "success"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                    : "bg-red-50 border-red-200 text-red-700"
                            }`}
                        >
                            <span className="text-base">{statusMessage.type === "success" ? "✅" : "⚠️"}</span>
                            <span className="font-medium">{statusMessage.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleCreateVendor} className="flex flex-col gap-6">
                        {/* Authority Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-3">Authority Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        placeholder="e.g. John Doe"
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.name && <p className="text-xs text-red-600 mt-1">{fieldErrors.name}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        placeholder="e.g. Acme Logistics"
                                        onChange={(e) => handleInputChange("companyName", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.companyName && <p className="text-xs text-red-600 mt-1">{fieldErrors.companyName}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Carrier Identifier
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.carrierIdentifier}
                                        placeholder="Leave blank to auto-generate"
                                        onChange={(e) => handleInputChange("carrierIdentifier", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email & Phone number */}
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-1">Email & Phone number</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
                                <div className="sm:col-span-2 md:col-span-4 border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        placeholder="admin@company.com"
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Country Code
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.countryCode}
                                        placeholder="+91"
                                        onChange={(e) => handleInputChange("countryCode", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        placeholder="9876543210"
                                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.phoneNumber && <p className="text-xs text-red-600 mt-1">{fieldErrors.phoneNumber}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-3">Address</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="sm:col-span-2 border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.addressLine1}
                                        placeholder="Street address or P.O. Box"
                                        onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.addressLine1 && <p className="text-xs text-red-600 mt-1">{fieldErrors.addressLine1}</p>}
                                </div>
                                <div className="sm:col-span-2 border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Address Line 2
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.addressLine2}
                                        placeholder="Apartment, suite, unit, building, floor, etc."
                                        onChange={(e) => handleInputChange("addressLine2", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        placeholder="City"
                                        onChange={(e) => handleInputChange("city", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.city && <p className="text-xs text-red-600 mt-1">{fieldErrors.city}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">State</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        placeholder="State / Province"
                                        onChange={(e) => handleInputChange("state", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.state && <p className="text-xs text-red-600 mt-1">{fieldErrors.state}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">PIN Code</label>
                                    <input
                                        type="text"
                                        value={formData.pincode}
                                        placeholder="PIN / ZIP code"
                                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.pincode && <p className="text-xs text-red-600 mt-1">{fieldErrors.pincode}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Country</label>
                                    <input
                                        type="text"
                                        value={formData.country}
                                        placeholder="Country"
                                        onChange={(e) => handleInputChange("country", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Domicile(s) */}
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-3">Domicile(s)</h3>
                            {fieldErrors.domiciles && <p className="text-xs text-red-600 mb-2">{fieldErrors.domiciles}</p>}
                            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50/70 text-zinc-600">
                                            <th className="text-left py-3 px-4 font-semibold w-10"></th>
                                            <th className="text-left py-3 px-4 font-semibold">Domicile</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-zinc-800">
                                        {AVAILABLE_DOMICILES.map((domicile) => (
                                            <tr key={domicile} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.domiciles.includes(domicile)}
                                                        onChange={() => handleDomicileToggle(domicile)}
                                                    />
                                                </td>
                                                <td className="py-3 px-4 font-medium">{domicile}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Documents */}
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-3">Documents</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">GSTIN</label>
                                    <input
                                        type="text"
                                        value={formData.documents.gstin}
                                        placeholder="27AADCB2230M1ZT"
                                        onChange={(e) => handleDocumentsChange("gstin", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.gstin && <p className="text-xs text-red-600 mt-1">{fieldErrors.gstin}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">PAN Card</label>
                                    <input
                                        type="text"
                                        value={formData.documents.panCard}
                                        placeholder="AADCB2230M"
                                        onChange={(e) => handleDocumentsChange("panCard", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.panCard && <p className="text-xs text-red-600 mt-1">{fieldErrors.panCard}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Carrier Agreement URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.documents.carrierAgreementUrl}
                                        placeholder="Optional"
                                        onChange={(e) => handleDocumentsChange("carrierAgreementUrl", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Programme Policy URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.documents.programmePolicyUrl}
                                        placeholder="Optional"
                                        onChange={(e) => handleDocumentsChange("programmePolicyUrl", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-3">Bank Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Account Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bankDetails.accountHolderName}
                                        onChange={(e) => handleBankDetailsChange("accountHolderName", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.accountHolderName && <p className="text-xs text-red-600 mt-1">{fieldErrors.accountHolderName}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.bankDetails.bankAccountNumber}
                                        onChange={(e) => handleBankDetailsChange("bankAccountNumber", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.bankAccountNumber && <p className="text-xs text-red-600 mt-1">{fieldErrors.bankAccountNumber}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">Bank Name</label>
                                    <input
                                        type="text"
                                        value={formData.bankDetails.bankName}
                                        onChange={(e) => handleBankDetailsChange("bankName", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.bankName && <p className="text-xs text-red-600 mt-1">{fieldErrors.bankName}</p>}
                                </div>
                                <div className="border border-zinc-200 bg-white p-2 rounded-lg focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">IFSC Code</label>
                                    <input
                                        type="text"
                                        value={formData.bankDetails.ifscCode}
                                        onChange={(e) => handleBankDetailsChange("ifscCode", e.target.value)}
                                        className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                    />
                                    {fieldErrors.ifscCode && <p className="text-xs text-red-600 mt-1">{fieldErrors.ifscCode}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Onboarding Source */}
                        <div>
                            <h3 className="text-lg font-semibold text-zinc-900 mb-3">Onboarding</h3>
                            <div className="border border-zinc-200 bg-white p-2 rounded-lg max-w-xs focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                                    Onboarding Source
                                </label>
                                <select
                                    value={formData.onboardingSource}
                                    onChange={(e) => handleInputChange("onboardingSource", e.target.value)}
                                    className="w-full text-sm text-zinc-800 font-medium focus:outline-none bg-transparent pt-1"
                                >
                                    <option value="ADMIN_ONBOARDED">Admin Onboarded</option>
                                    <option value="SELF_ONBOARDED">Vendor Self-Onboarded (pending verification)</option>
                                </select>
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
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    "Create Vendor"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateVendor;