import Image from 'next/image';
import { FaceImageCircleProps } from '../types/face-type';

export default function FaceImageCircle({ registered, faceImageUrl }: FaceImageCircleProps) {
  return (
    <div className="relative flex items-center justify-center w-32 h-32 overflow-hidden bg-gray-200 rounded-full">
      {registered && <Image fill src={faceImageUrl} alt="myFace" className="object-cover" />}
      {!registered && <span className="text-2xl font-bold text-gray-400">?</span>}
    </div>
  );
}
