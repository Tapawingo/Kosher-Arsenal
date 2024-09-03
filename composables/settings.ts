export const useUserSetting = (): Promise<Array<{ setting: string, value: string }>> => {
  return $fetch('/api/userSetting/get');
}

export const setUserSetting = (setting: string, value?: string): Promise<Array<{ setting: string, value: string }>> => {
  return $fetch('/api/userSetting/update', {
    method: "POST",
    body: {
      setting: setting,
      value: value
    }
  });
}
