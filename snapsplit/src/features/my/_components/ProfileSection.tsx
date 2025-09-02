import Image from 'next/image';

type ProfileSectionProps = {
  name: string;
  profileImage: string;
  userCode: string;
};

export default function ProfileSection({ name, profileImage, userCode }: ProfileSectionProps) {
  return (
    <div className="flex flex-col items-center gap-2 pt-3 pb-10">
      <div className="relative">
        <div className="rounded-full w-22.5 h-22.5 overflow-hidden">
          <Image src={profileImage} alt="profile" width={100} height={100} className="object-cover" priority />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full overflow-hidden">
          <Image src="/svg/edit-green.svg" alt="profile" width={100} height={100} className="object-cover" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-head-0">{name}</p>
        <p className="text-body-3 text-green">{userCode}</p>
      </div>
    </div>
  );
}
