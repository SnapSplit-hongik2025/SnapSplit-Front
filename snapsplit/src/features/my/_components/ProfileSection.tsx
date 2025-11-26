import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { updateMyData } from '@/features/my/api/my-api';
import editIcon from '@public/svg/edit-green.svg';
import { useQueryClient } from '@tanstack/react-query'; // [1] import 추가

type ProfileSectionProps = {
  name: string;
  profileImage: string;
  userCode: string;
};

export default function ProfileSection({ name, profileImage, userCode }: ProfileSectionProps) {
  const queryClient = useQueryClient(); // [2] queryClient 초기화

  const fileRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<string>(name);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setProfileName(name);
    if (!preview) return;
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview, name]);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const onPick = () => {
    fileRef.current?.click();
  };

  const startEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    setFile(null);
    setPreview(null);
    setProfileName(name);
    if (fileRef.current) fileRef.current.value = '';
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

  // 수정 완료 버튼 클릭
  const onSubmit = async () => {
    if (profileName === name && !file) {
      setIsEditing(false);
      return;
    }

    try {
      await updateMyData({
        name: profileName !== name ? profileName : undefined,
        profileImage: file || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['myData'] });

      setIsEditing(false);
      setPreview(null);
      setFile(null);
      alert('프로필이 성공적으로 수정되었습니다.');
    } catch (e) {
      console.error('프로필 업데이트 실패:', e);
      alert('프로필 업데이트에 실패했습니다.');
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
            className="object-cover w-full h-full"
            priority
          />
        </div>
        {isEditing && (
          <button
            onClick={onPick}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex items-center justify-center border border-grey-200"
          >
            <Image src={editIcon} alt="edit profile image" width={18} height={18} />
          </button>
        )}
        <input type="file" accept="image/*" ref={fileRef} onChange={onFileChange} className="hidden" />
      </div>

      <div className="flex flex-col items-center gap-1 w-full px-10">
        {isEditing ? (
          <input
            ref={nameInputRef}
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="text-head-0 text-center border-b border-grey-300 focus:border-green outline-none pb-1 w-full"
          />
        ) : (
          <div className="flex items-center gap-2 relative">
            <span className="text-head-0 text-center">{profileName}</span>
            <button onClick={startEdit} className="w-5 h-5">
              <Image src={editIcon} alt="edit name" width={20} height={20} />
            </button>
          </div>
        )}
        <p className="text-body-3 text-green">{userCode}</p>
      </div>

      {isEditing && (
        <div className="flex gap-3 mt-4 w-full px-5">
          <button
            onClick={onCancel}
            className="flex-1 border-1 border-grey-350 py-3 cursor-pointer rounded-xl bg-grey-200 text-body-1 text-grey-700"
          >
            취소
          </button>
          <button onClick={onSubmit} className="flex-1 py-3 cursor-pointer rounded-xl bg-green text-body-1 text-white">
            수정
          </button>
        </div>
      )}
    </div>
  );
}
