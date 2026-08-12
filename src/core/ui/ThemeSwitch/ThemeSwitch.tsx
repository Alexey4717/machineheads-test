import { Switch } from 'antd';

export type ThemeMode = 'light' | 'dark';

interface ThemeSwitchProps {
  value: ThemeMode;
  onChange: (value: ThemeMode) => void;
}

export const ThemeSwitch = ({ value, onChange }: ThemeSwitchProps) => {
  return (
    <Switch
      checkedChildren="Тёмная"
      unCheckedChildren="Светлая"
      checked={value === 'dark'}
      onChange={(checked) => onChange(checked ? 'dark' : 'light')}
    />
  );
};
