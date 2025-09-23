export type InputTripNameSectionProps = {
    onClick: () => void
    tripName?: string;
    setTripName: (name: string) => void;
    tripImageUrl: string | null;
    setTripImageUrl: (url: string) => void;
    setTripImageFile: (file: File | null) => void;
    variant?: 'create' | 'edit';
};
 
export interface TripImageUploaderProps {
  tripImageUrl: string | null;
  setTripImageUrl: (url: string) => void;
  setTripImageFile: (file: File | null) => void;
}