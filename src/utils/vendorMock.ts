import type { VendorRecord } from "../components/types/vendorPayload";


// Adjust these fields freely — this is the only place the "Company Info" tab
// pulls its starting data from. No backend call is made anywhere for this page.
export const mockVendorData: VendorRecord = {
    id: "vendor_mock_1",
    name: "Admin",
    companyName: "Taapmaan Logistics Pvt Ltd",
    carrierIdentifier: "TAP-CARRIER-0001",
    email: "admin@company.com",
    // Never rendered or edited on this page — placeholder only, since
    // CreateVendorPayload requires it for the (unused) signup payload shape.
    password: "",
    countryCode: "+91",
    phoneNumber: "9876543210",
    addressLine1: "4th Floor, Cyber Hub",
    addressLine2: "DLF Phase 2",
    city: "Gurugram",
    state: "Haryana",
    pincode: "122002",
    country: "India",
    domiciles: ["Gurugram, Haryana", "Mumbai, Maharashtra"],
    onboardingSource: "SELF_ONBOARDED",
    documents: {
        gstin: "06ABCDE1234F1Z5",
        panCard: "ABCDE1234F",
        carrierAgreementUrl: "",
        programmePolicyUrl: "",
    },
    bankDetails: {
        accountHolderName: "Taapmaan Logistics Pvt Ltd",
        bankAccountNumber: "123456789012",
        bankName: "HDFC Bank",
        ifscCode: "HDFC0001234",
    },
    status: "ACTIVE",
    createdAt: "2026-01-05T10:00:00.000Z",
    updatedAt: "2026-01-05T10:00:00.000Z",
};