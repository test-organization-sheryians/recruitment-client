export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface UpdatePasswordPayload {
  oldPassword: string
  newPassword: string
}