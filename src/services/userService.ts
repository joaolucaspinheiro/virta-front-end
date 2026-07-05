import { apiFetch } from "@/lib/http";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  photo: string | null;
  createdAt: string;
}

const ME = "/api/v1/users/me";

export function getMe(): Promise<UserProfile> {
  return apiFetch<UserProfile>(ME);
}

export function updateProfile(name: string): Promise<UserProfile> {
  return apiFetch<UserProfile>(ME, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  return apiFetch<void>(`${ME}/password`, {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
