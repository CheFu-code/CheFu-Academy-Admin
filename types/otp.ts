export interface SendOtpRequestBody {
    phone: string;
}

export interface SendOtpResponseSuccess {
    success: true;
    otp: number;
}

export interface SendOtpResponseError {
    error: string;
}