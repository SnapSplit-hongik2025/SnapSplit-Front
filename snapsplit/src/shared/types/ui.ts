// Search Bar
export enum SearchBarType {
    WithIcon = 'WITH_ICON',
    WithoutIcon = 'WITHOUT_ICON',
  }

export type SearchBarProps = {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};