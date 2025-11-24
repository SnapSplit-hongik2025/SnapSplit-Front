'use client';

import { Folder } from '../../types/snap-dto-types';
import FolderThumbnailPreview from './FolderThumbnailPreview';
import { useParams, useRouter } from 'next/navigation';

type FolderTabViewProps = {
  folders?: Folder[];
  selectedSort: 'date_desc' | 'date_asc';
}

export default function FolderTabView({ folders, selectedSort }: FolderTabViewProps) {
  const router = useRouter();
  const params = useParams();

  const tripId = params.tripId;

  if (folders?.length === 0 || !folders) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-label-1 text-grey-450 pb-10">사진을 업로드하면 <br /> 인물별 사진을 폴더로 모아줘요!</div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-24">
      <div className="grid grid-cols-2 gap-x-2 gap-y-5">
        {folders?.map((folder) => {
          return (
            <div 
              key={folder.id} 
              onClick={() => {
                const params = new URLSearchParams({
                  name: folder.name,
                });
                router.push(`/trip/${tripId}/snap/${folder.id}?${params.toString()}`);
              }}
            >
              {/* 썸네일 - 폴더 내 사진 4개를 그리드로 표시 */}
              <FolderThumbnailPreview memberId={folder.id.toString()} sortKey={selectedSort}/>
              {/* 폴더 이름 */}
              <div className="flex justify-center items-center pt-2 h-8 text-body-1">{folder.name}의 사진</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
