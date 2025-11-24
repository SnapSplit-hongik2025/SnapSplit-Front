export type SelectDateSectionProps = {
    onClick: () => void;
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    variant?: 'create' | 'edit';
};