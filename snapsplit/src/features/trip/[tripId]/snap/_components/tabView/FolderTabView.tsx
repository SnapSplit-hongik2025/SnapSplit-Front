'use client';

import { Folder } from '../../types/snap-dto-types';
import FolderThumbnailPreview from './FolderThumbnailPreview';
import { useParams, useRouter } from 'next/navigation';

type FolderTabViewProps = {
  folders?: Folder[];
}

export default function FolderTabView({ folders }: FolderTabViewProps) {
  const router = useRouter();
  const params = useParams();

  const tripId = params.tripId;

  return (
    <div className="px-5 pt-6 pb-24">
      <div className="grid grid-cols-2 gap-x-2 gap-y-5">
        {folders?.map((folder) => {
          const profileImageUrl = folder.profileImageUrl || '';
          return (
            <div 
              key={folder.id} 
              onClick={() => {
                const params = new URLSearchParams({
                  name: folder.name,
                  ...(profileImageUrl && { profileImageUrl })
                });
                router.push(`/trip/${tripId}/snap/${folder.id}?${params.toString()}`);
              }}
            >
              {/* 썸네일 */}
              <FolderThumbnailPreview />
              {/* 폴더 이름 */}
              <div className="flex justify-center items-center pt-2 h-8 text-body-1">{folder.name}의 사진</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
