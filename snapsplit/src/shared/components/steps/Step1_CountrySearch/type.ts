// Country Search Section Props
import { Country } from '@/shared/types/country';

export type CountrySearchSectionProps = {
  countries: Country[];
  selected: Country[];
  onToggle: (country: Country) => void;
  onClick: () => void;
  variant?: 'create' | 'edit';
};

// Country List Props
export type CountryListProps = {
  countries: Country[];
  selected: Country[];
  onToggle: (country: Country) => void;
  variant?: 'create' | 'edit';
};

// Country Component Props
export type CountryComponentProps = {
  countryName: string;
  isSelected: boolean;
  onClick: () => void;
};

// Selected Country List Props
export type SelectedCountryListProps = {
  selected: Country[];
  onRemove: (country: Country) => void;
};

// Selected Country Component Props
export type SelectedCountryProps = { country: Country; onRemove: (country: Country) => void };
