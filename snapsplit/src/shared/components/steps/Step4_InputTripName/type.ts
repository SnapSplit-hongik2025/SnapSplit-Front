export type InputTripNameSectionProps = {
  onClick: () => void
  tripName?: string;
  setTripName: (name: string) => void;
  tripImageUrl: string | null;
  setTripImageUrl: (url: string | null) => void;
    setTripImageFile: (file: File | null) => void;
    variant?: 'create' | 'edit';
};
 
export interface TripImageUploaderProps {
  tripImageUrl: string | null;
  setTripImageUrl: (url: string | null) => void;
  setTripImageFile: (file: File | null) => void;
}