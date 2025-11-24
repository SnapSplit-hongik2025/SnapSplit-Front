import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { updateMyData } from '@/features/my/api/my-api';

type ProfileSectionProps = {
  name: string;
  profileImage: string;
  userCode: string;
};

export default function ProfileSection({ name, profileImage, userCode }: ProfileSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>(name);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // 메모리 해제
  useEffect(() => {
    if (!preview) return;
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onPick = () => {
    fileRef.current?.click();
    setIsEditing(true);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 1024 * 1024 * 5) {
      alert('이미지 파일 크기는 5MB 이하만 가능합니다.');
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async () => {
    if (!profileName && !file) return alert('이름과 프로필 이미지 중 하나는 필수입니다.');
    try {
      await updateMyData({
        name: profileName || undefined,
        profileImage: file || undefined,
      });
      setIsEditing(false);
      setPreview(null);
      setFile(null);
    } catch (e) {
      console.error('프로필 업데이트 실패:', e);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 pt-3 pb-10">
      <div className="relative">
        <div className="rounded-full w-22.5 h-22.5 overflow-hidden">
          <Image
            src={preview || profileImage}
            alt="profile"
            width={100}
            height={100}
            className="object-cover"
            priority
          />
        </div>
        <button
          onClick={!preview ? onPick : onSubmit}
          className="absolute bottom-0 right-0 w-6 h-6 rounded-full overflow-hidden"
        >
          <Image
            src={!preview ? '/svg/edit-green.svg' : '/svg/check-green.svg'}
            alt="profile"
            width={100}
            height={100}
            className="object-cover"
          />
        </button>

        <input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} className="hidden" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <input
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          className="text-head-0 text-center"
          disabled={!isEditing}
        />
        <p className="text-body-3 text-green">{userCode}</p>
      </div>
    </div>
  );
}
