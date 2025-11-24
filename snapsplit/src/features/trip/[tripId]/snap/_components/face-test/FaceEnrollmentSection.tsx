import { EnrollmentMemberItem } from './EnrollmentMemberItem';

export type MemberData = {
  userId: number;
  name: string;
  profileImageUrl: string;
  hasFaceData: boolean;
  currentUser: boolean;
};

type FaceEnrollmentSectionProps = {
  members: MemberData[];
};

export const FaceEnrollmentSection = ({ members }: FaceEnrollmentSectionProps) => {
  return (
    <div className="flex flex-col h-full w-full justify-center text-center p-10 pb-40">
      <span className="text-grey-450 text-label-1">전원 얼굴 등록 이후</span>
      <span className="text-grey-450 text-label-1 pb-10">SNAP 기능을 사용할 수 있어요!</span>
      <div className="relative">
        <div className="space-y-5 bg-white rounded-2xl p-5 max-h-72 overflow-y-auto scrollbar-hide">
          {members.map((m) => (
            <EnrollmentMemberItem key={m.userId} member={m} />
          ))}
        </div>
        {/* 상/하 스크롤 힌트 그라데이션 */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white to-transparent rounded-t-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-white to-transparent rounded-b-2xl" />
      </div>
    </div>
  );
};