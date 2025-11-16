import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export type FaceEnrollButtonProps = {
  hasFaceData?: boolean;
  isCurrentUser?: boolean;
};

export const FaceEnrollButton = ({ hasFaceData, isCurrentUser }: FaceEnrollButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/my/face');
  };

  return (
    <button
      disabled={hasFaceData || !isCurrentUser}
      className={
        clsx('flex items-center justify-center min-w-16 h-7 rounded-lg text-body-2', {
          'bg-white text-grey-450 border border-grey-250': hasFaceData,
          'bg-primary text-white': !hasFaceData && isCurrentUser,
          'bg-grey-350 text-white': !hasFaceData && !isCurrentUser,
          'cursor-pointer': !hasFaceData && isCurrentUser,
        })
      }
      onClick={handleClick}
    >
      {hasFaceData ? '등록완료' : isCurrentUser ? '등록하기' : '미등록'}
    </button>
  );
};
