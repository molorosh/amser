export interface Setting {
  settingName: string;
  settingValue: string | null;
}

export function createSetting(
  settingName: string,
  settingValue: string | null = null
): Setting {
  if (!settingName || settingName.trim() === '') {
    throw new Error('Setting name cannot be null or empty');
  }
  return {
    settingName: settingName.trim(),
    settingValue,
  };
}
