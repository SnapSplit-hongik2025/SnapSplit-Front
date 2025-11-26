import { useRef, useState } from 'react';
import Image from 'next/image';
import Button from '@/shared/components/Button';
import { PhotoTagMember } from '@/features/trip/[tripId]/snap/type';
import { tagPhoto } from '@/features/trip/[tripId]/snap/api/snap-api';

type Props = {
  members: PhotoTagMember[];
  onClose: () => void;
  tripId: number;
  photoId: number | null;
};

const PhotoTagModalContent = ({ onClose, members, tripId, photoId }: Props) => {
  const modalBackground = useRef<HTMLDivElement>(null);

  console.log("members", members);

  const [selectedMembers, setSelectedMembers] = useState<number[]>(members
  .filter(member => member.isTagged)
  .map(member => member.userId)
  );

  if (!photoId) {
    return null;
  }

  const handleApply = async () => {
    await tagPhoto(tripId, photoId, selectedMembers);
  }

  return (
    <div
      className={`w-full h-full bg-black/40 flex items-center justify-center`}
      ref={modalBackground}
      onClick={(e) => {
        if (e.target === modalBackground.current) {
          onClose();
        }
      }}
    >
      <div className="flex flex-col w-full bg-white m-5 p-5 rounded-xl items-center">
        <div className="flex items-end justify-end pb-2 w-full">
          <button onClick={onClose} className="cursor-pointer">
            <Image src="/svg/exit-grey-1000.svg" width={24} height={24} alt="close" />
          </button>
        </div>
        <span className="text-title-1 pb-6">인물 태그 수정하기</span>
        {/* 인물 선택 리스트 */}
        {members.map((member) => (
          <div key={member.userId} className="flex w-[60%] justify-between items-center gap-2 mb-2">
            <span>{member.name}</span>
            <button
              className={`cursor-pointer w-6 h-6 rounded-full border ${selectedMembers.includes(member.userId) ? 'border-primary bg-primary' : 'border-grey-350'}`}
              onClick={() => {
                if (selectedMembers.includes(member.userId)) {
                  setSelectedMembers(selectedMembers.filter((id) => id !== member.userId));
                } else {
                  setSelectedMembers([...selectedMembers, member.userId]);
                }
              }}
            >
              <Image
                src={
                  selectedMembers.includes(member.userId)
                    ? '/svg/check-expense-white.svg'
                    : '/svg/check-expense-grey.svg'
                }
                width={24}
                height={24}
                alt="close"
              />
            </button>
          </div>
        ))}
        <div className="flex gap-3 w-full pt-6">
          <Button label="취소" bg="bg-grey-650" onClick={onClose} />
          <Button label="적용" bg="bg-primary" onClick={handleApply} />
        </div>
      </div>
    </div>
  );
};

export default PhotoTagModalContent;
