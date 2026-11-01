import { api } from "./api/axios";

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  phone?: string;
  role?: string;
  active: boolean;
  createdAt: string;
}

type CurrentUserAvatarResponse = Pick<UserResponseDto, "id" | "avatar">;

export async function findAllUsers(
  active?: boolean,
): Promise<UserResponseDto[]> {
  const { data } = await api.get<UserResponseDto[]>("/users", {
    params: active !== undefined ? { active: String(active) } : undefined,
  });
  return data;
}

export async function updateCurrentUserAvatar(avatar: string) {
  const { data } = await api.patch<CurrentUserAvatarResponse>(
    "/users/me/avatar",
    { avatar },
  );
  return data;
}

export async function changeUserPassword(
  id: string,
  input: { currentPassword: string; newPassword: string },
) {
  const { data } = await api.put(`/users/${id}/password`, input);
  return data;
}
