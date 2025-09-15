import { MemberData } from '../FaceTestPage';
import { FaceEnrollButton } from './FaceEnrollButton';

export const EnrollmentMemberItem = ({ member }: { member: MemberData }) => {
  return (
    <div key={member.memberId} className="flex items-center justify-between">
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 bg-grey-450 rounded-full"></div>
        <span className="text-body-1 whitespace-nowrap text-grey-850">
          {member.isCurrentUser ? '(나)' : member.name}
        </span>
      </div>
      <FaceEnrollButton hasFaceData={member.hasFaceData} isCurrentUser={member.isCurrentUser} />
    </div>
  );
};
