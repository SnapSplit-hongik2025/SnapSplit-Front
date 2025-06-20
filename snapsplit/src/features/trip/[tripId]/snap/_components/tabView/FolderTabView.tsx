'use client';

import { useRouter, useParams } from 'next/navigation';
import FolderThumbnailPreview from './FolderThumbnailPreview';

const folders = [
  { name: '유빈', id: 'yubin' },
  { name: '지수', id: 'jisu' },
  { name: '나경', id: 'nagyeong' },
  { name: '연수', id: 'yeonsu' },
];

export default function FolderTabView() {
  const router = useRouter();
  const { tripId } = useParams();

  return (
    <div className="px-4 pb-24">
        <div className="grid grid-cols-2 gap-4 mt-4">
      {folders.map(folder => (
        <div
          key={folder.id}
          className="mb-6 cursor-pointer"
          onClick={() => router.push(`/trip/${tripId}/snap/folder/${folder.id}`)}
        >
            {/* 썸네일 */}
          <FolderThumbnailPreview />
          {/* 폴더 이름 */}
          <div className="mt-2 text-center text-sm text-grey-750">{folder.name}</div>
        </div>
      ))}
      </div>
    </div>
  );
}
