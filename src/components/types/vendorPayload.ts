
export interface VendorDocuments {
    gstin: string;
    panCard: string;
    carrierAgreementUrl?: string;
    programmePolicyUrl?: string;
}

export interface VendorBankDetails {
    bankName: string;
    accountHolderName: string;
    ifscCode: string;
    bankAccountNumber: string;
}

export type OnboardingSource = 'SELF_ONBOARDED' | 'ADMIN_ONBOARDED'; // confirm ADMIN_ONBOARDED value with backend — only SELF_ONBOARDED is shown in the docs you shared

export interface CreateVendorPayload {
    name: string;
    companyName: string;
    carrierIdentifier?: string;
    email: string;
    password: String;
    countryCode: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    domiciles: string[];
    onboardingSource: OnboardingSource;
    documents: VendorDocuments;
    bankDetails: VendorBankDetails;
}

export interface VendorRecord extends CreateVendorPayload {
    id: string;
    status: 'PENDING' | 'ACTIVE' | string;
    createdAt: string;
    updatedAt: string;
}

export interface VendorFieldError {
    field: string;
    message: string;
}

export interface CreateVendorResponse {
    success: boolean;
    message: string;
    data?: VendorRecord;
    error?: string;
    errors?: VendorFieldError[];
}