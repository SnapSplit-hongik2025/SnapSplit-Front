import Image from 'next/image';
import unchecked from '@public/svg/check_grey.svg';
import checked from '@public/svg/check-green.svg';
import { Member } from '@/shared/types/member';

export interface MemberPickBottomSheetProps {
  members?: Member[];
  setSelectedMemberId: (id: number) => void;
  selectedMemberId: number | null;
  onClose: () => void;
}

export interface MemberItemProps {
  id: number;
  name: string;
  isSelected?: boolean;
  onClick: () => void;
}

const MemberItem = ({ name, isSelected, onClick }: MemberItemProps) => {
  return (
    <div onClick={onClick} className="py-3 flex gap-1 justify-start cursor-pointer items-center">
      <Image src={isSelected ? checked : unchecked} alt="check Icon" />
      <label className={`text-body-1 cursor-pointer ${isSelected ? 'text-primary' : ''}`}>{name}</label>
    </div>
  );
};

export default function MemberPickBottomSheet({
  members = [],
  setSelectedMemberId,
  selectedMemberId,
  onClose,
}: MemberPickBottomSheetProps) {
  return (
    <div className="flex flex-col w-full">
      {members.map((member) => (
        <MemberItem
          key={member.memberId}
          id={member.memberId}
          name={member.name}
          isSelected={member.memberId === selectedMemberId}
          onClick={() => {
            setSelectedMemberId(member.memberId);
            onClose();
          }}
        />
      ))}
    </div>
  );
}
