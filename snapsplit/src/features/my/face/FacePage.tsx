'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyFaceData, postMyFace, putMyFace } from './api/face-api';
import FaceHeader from './_components/FaceHeader';
import TipInfoBox from './_components/TipInfoBox';
import FaceImageCircle from './_components/FaceImageCircle';
import Button from '@/shared/components/Button';
import { useRef, useState, useEffect } from 'react';
import { GetMyFaceDto } from './types/face-dto-type';
import Loading from '@/shared/components/loading/Loading';

export default function BeforeRegistration() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [curFaceImgFile, setCurFaceImgFile] = useState<File | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery<GetMyFaceDto, Error>({
    queryKey: ['face'],
    queryFn: getMyFaceData,
  });

  const { mutate: uploadFace } = useMutation<unknown, Error, File>({
    mutationFn: (imageFile: File) => postMyFace(imageFile),
    onSuccess: () => {
      alert('얼굴이 성공적으로 처리되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['face'] });
      setCurFaceImgFile(null);
      setPreviewImageUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    onError: (err) => {
      alert(err.message || '얼굴 처리에 실패했습니다.');
    },
  });

  const { mutate: changeFace } = useMutation<unknown, Error, File>({
    mutationFn: (imageFile: File) => putMyFace(imageFile),
    onSuccess: () => {
      alert('얼굴이 성공적으로 처리되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['face'] });
      setCurFaceImgFile(null);
      setPreviewImageUrl(null);
    },
    onError: (err) => {
      alert(err.message || '얼굴 처리에 실패했습니다.');
    },
  });

  // 파일 선택창을 여는 함수
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  // 사용자가 파일을 선택했을 때 처리하는 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCurFaceImgFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImageUrl(previewUrl);

      // 동일 파일 재선택 가능하게 입력값 초기화
      e.target.value = '';
    }
  };

  const handleUploadSubmit = () => {
    if (curFaceImgFile) {
      console.log(curFaceImgFile);
      uploadFace(curFaceImgFile);
    } else {
      alert('먼저 얼굴 이미지를 선택해주세요.');
    }
  };

  const handleChangeSubmit = () => {
    if (curFaceImgFile) {
      console.log(curFaceImgFile);
      changeFace(curFaceImgFile);
    } else {
      alert('먼저 얼굴 이미지를 선택해주세요.');
    }
  };

  // 컴포넌트 언마운트 시 Object URL 정리
  useEffect(() => {
    return () => {
      if (previewImageUrl) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading />
      </div>
    );
  }
  if (isError) {
    return <div>에러 발생: {error.message}</div>;
  }
  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

  const displayImageUrl = previewImageUrl || data?.faceImageUrl;
  const isImageAvailable = !!displayImageUrl;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-white px-5">
      <FaceHeader />
      <div className="flex flex-col items-center text-center space-y-6 pt-12">
        <FaceImageCircle registered={isImageAvailable} faceImageUrl={displayImageUrl} />
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        {data?.registered || curFaceImgFile ? (
          <div className="flex flex-col space-y-2 w-full">
            <Button label="다른 사진 선택하기" onClick={handleSelectFileClick} />
            {data?.registered && curFaceImgFile && (
              <Button label="이 얼굴로 변경하기" onClick={handleChangeSubmit} bg="bg-grey-750" />
            )}
          </div>
        ) : (
          <Button label="나의 얼굴 등록하기" onClick={handleSelectFileClick}></Button>
        )}
        {!data?.registered && curFaceImgFile && <Button label="이 얼굴로 등록하기" onClick={handleUploadSubmit} />}
        <TipInfoBox />
      </div>
    </div>
  );
}
