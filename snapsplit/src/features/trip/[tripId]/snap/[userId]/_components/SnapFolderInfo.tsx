import Image from "next/image";

type Props = {
  name: string;
  profileImageUrl?: string;
};

function SnapFolderInfo({ name, profileImageUrl }: Props) {
  return (
    <div className="px-5 pb-5">
      <div className="flex items-center gap-2 text-label-1">
        {profileImageUrl ? (
          <div className="w-5 h-5 rounded-full overflow-hidden">
            <Image 
              src={profileImageUrl} 
              alt={name} 
              width={20} 
              height={20}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <Image src="/svg/profile_folder.svg" alt="프로필" width={20} height={20} />
        )}
        <div>{name}</div>
      </div>
    </div>
  );
}

export default SnapFolderInfo;