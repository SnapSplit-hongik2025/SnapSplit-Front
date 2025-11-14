"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import TabSelector from "@/features/trip/[tripId]/snap/_components/TabSelector";
import UploadButton from "@/features/trip/[tripId]/snap/_components/UploadButton";
import TripHeader from "../../../../shared/components/TripHeader";
import TripInfo from "../budget/_components/TripInfo";
import BaseTabView from "@/features/trip/[tripId]/snap/_components/tabView/BaseTabView";
import FolderTabView from "@/features/trip/[tripId]/snap/_components/tabView/FolderTabView";
import { ActiveTab } from "@/features/trip/[tripId]/snap/type";
import FloatingModal from "@/shared/components/modal/FloatingModal";
import {
  uploadImage,
  getPhotos,
  getReadiness,
} from "@/features/trip/[tripId]/snap/api/snap-api";
import { GetPhotosDto } from "@/features/trip/[tripId]/snap/types/snap-dto-types";
import { getTripBudgetData } from "../budget/api/budget-api";
import { GetTripBudgetDto } from "../budget/types/budget-dto-type";
import { Folder } from "@/features/trip/[tripId]/snap/types/snap-dto-types";
import { useSnapStore } from "./store/snapStore";
import Loading from "@/shared/components/loading/Loading";

type SnapPageProps = {
  tripId: string;
};

export default function SnapPage({ tripId }: SnapPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>("전체");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollToTop, setScrollToTop] = useState<(() => void) | null>(null);
  const [selectedSort, setSelectedSort] = useState("최신순");

  // trip info
  const [data, setData] = useState<GetTripBudgetDto | null>(null);
  const [tripError, setTripError] = useState<Error | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);

  // photos
  const { setAllPhotos } = useSnapStore();
  const [photos, setPhotos] = useState<GetPhotosDto["photos"]>([]);
  const [photosError, setPhotosError] = useState<Error | null>(null);

  // pagination
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  // 중복 요청 방지
  const isFetchingRef = useRef(false);

  /** ===========================================
   * 📸 fetchPhotos (중복 방지 + useCallback)
   * =========================================== */
  const fetchPhotos = useCallback(
    async (pageToLoad: number) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);

      try {
        const sort = selectedSort === "최신순" ? "date_desc" : "date_asc";
        const res = await getPhotos(Number(tripId), pageToLoad, sort);

        setPhotos((prev) => {
          const merged =
            pageToLoad === 0 ? res.photos : [...prev, ...res.photos];

          setAllPhotos(merged); // zustand 저장
          return merged;
        });

        setPage(pageToLoad);
        setHasNext(!res.last);
      } catch (e) {
        setPhotosError(e as Error);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
    },
    [tripId, selectedSort, setAllPhotos]
  );

  /** ===========================================
   * 🔄 새로고침
   * =========================================== */
  const handleRefresh = async () => {
    setPhotos([]);
    setPage(0);
    Promise.resolve().then(() => fetchPhotos(0));
  };

  /** ===========================================
   * 📤 이미지 업로드
   * =========================================== */
  const imageSubmit = async (file: File) => {
    try {
      await uploadImage(Number(tripId), file);
      await handleRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  /** ===========================================
   * 📄 readiness 체크 (최초 1번)
   * =========================================== */
  useEffect(() => {
    let cancelled = false;

    getReadiness(Number(tripId))
      .then((readiness) => {
        if (cancelled) return;

        if (!readiness.allMembersRegistered) {
          alert("모든 멤버가 얼굴 정보를 등록해야 합니다.");
        }

        const memberFolders = readiness.members
          .filter((m) => m.hasFaceData)
          .map((m) => ({ id: m.userId, name: m.name }));

        setFolders(memberFolders);
      })
      .catch((e) => {
        if (!cancelled) console.error("Readiness error:", e);
      });

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  /** ===========================================
   * 📘 여행 기본 정보 + 첫 페이징
   * =========================================== */
  useEffect(() => {
    let cancelled = false;

    getTripBudgetData(Number(tripId))
      .then((trip) => {
        if (cancelled) return;

        setData(trip);
        setPhotos([]);
        setPage(0);

        // 🔥 렌더 이후 fetchPhotos 실행 → 절대 render 중 setState 발생 안 함
        Promise.resolve().then(() => {
          if (!cancelled) fetchPhotos(0);
        });
      })
      .catch((e) => {
        if (!cancelled) setTripError(e as Error);
      });

    return () => {
      cancelled = true;
    };
  }, [tripId, fetchPhotos]);

  /** ===========================================
   * 🔄 정렬 변경 시 리셋
   * =========================================== */
  useEffect(() => {
    if (!data) return;

    setPhotos([]);
    setPage(0);

    Promise.resolve().then(() => {
      fetchPhotos(0);
    });
  }, [selectedSort, data, fetchPhotos]);

  /** ===========================================
   * 📥 무한 스크롤 load more
   * =========================================== */
  const handleLoadMore = () => {
    if (!loading && hasNext && !isFetchingRef.current) {
      fetchPhotos(page + 1);
    }
  };

  /** ===========================================
   * 로딩 처리
   * =========================================== */
  if (tripError || photosError) return <Loading />;
  if (!data) return <Loading />;

  /** ===========================================
   * UI 렌더링
   * =========================================== */
  return (
    <div className="flex flex-col h-screen bg-light_grey">
      {/* 헤더 */}
      <div className="bg-white">
        <TripHeader tripId={tripId} />
        {isScrolled ? (
          <div className="px-5">
            <span className="text-label-1">{data.tripName}</span>
          </div>
        ) : (
          <TripInfo
            tripName={data.tripName}
            countries={data.countries}
            startDate={data.startDate ?? ""}
            endDate={data.endDate ?? ""}
          />
        )}
      </div>

      {/* 탭 */}
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 내용 */}
      {activeTab === "전체" ? (
        <BaseTabView
          setIsScrolled={setIsScrolled}
          setScrollToTop={setScrollToTop}
          photos={photos}
          onLoadMore={handleLoadMore}
          isLoading={loading}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          onRefresh={handleRefresh}
        />
      ) : (
        <FolderTabView folders={folders} />
      )}

      {/* 플로팅 업로드 */}
      <FloatingModal>
        <UploadButton
          isScrolled={isScrolled}
          inputRef={fileInputRef}
          scrollToTop={scrollToTop}
        />
      </FloatingModal>

      {/* 파일 인풋 */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) imageSubmit(file);
        }}
      />
    </div>
  );
}
