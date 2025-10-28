import Image from 'next/image';
import { FaceImageCircleProps } from '../types/face-type';

export default function FaceImageCircle({ registered, faceImageUrl }: FaceImageCircleProps) {
  return (
    <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full">
      {registered && <Image width={32} height={32} src={faceImageUrl} alt="myFace" className="object-fit" />}
      {!registered && <span className="text-2xl font-bold text-gray-400">?</span>}
    </div>
  );
}
