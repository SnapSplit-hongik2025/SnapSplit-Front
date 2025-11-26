import clsx from 'clsx';
import { MemberData } from './FaceEnrollmentSection';
import { FaceEnrollButton } from './FaceEnrollButton';
import Image from 'next/image';

type Props = {
  member: MemberData;
}

export const EnrollmentMemberItem = ({ member }: Props) => {
  return (
    <div key={member.userId} className="flex items-center justify-between">
      <div className="flex items-center justify-center gap-3">
        <div className="relative w-10 h-10">
          {/* 프로필 이미지 */}
          <div
            className={clsx('w-10 h-10 rounded-full', { 'border border-primary bg-grey-400': member.currentUser })}
          >
            {member.currentUser ? <Image src={member.profileImageUrl || '/svg/photo-loading.svg'} alt="Current User" width={40} height={40} /> : null}
          </div>
          {/* 체크 아이콘 */}
          {member.hasFaceData && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-primary text-white text-[10px]">
              ✓
            </div>
          )}
        </div>

        <span className="text-body-1 whitespace-nowrap text-grey-850">
          {member.currentUser ? '(나)' : member.name}
        </span>
      </div>
      <FaceEnrollButton hasFaceData={member.hasFaceData} isCurrentUser={member.currentUser} />
    </div>
  );
};
