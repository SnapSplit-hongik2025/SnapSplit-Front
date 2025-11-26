'use client';

import Image from 'next/image';
import arrowLeft from '@public/svg/arrow-left-grey-1000.svg';
import Link from 'next/link';
import { useState } from 'react';
import DeleteExpenseModal from './modal/DeleteExpenseModal';
import SettledExpenseModal from './modal/SettledExpenseModal';
import { deleteExpense } from '../api/expense-detail';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface ExpenseDetailHeaderProps {
  tripId: string;
  expenseId: string;
  canAddExpense: boolean;
}

export default function ExpenseDetailHeader({ tripId, expenseId, canAddExpense }: ExpenseDetailHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 삭제 확인 모달 (기존)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 정산됨 경고 모달 (신규)
  const [isSettledModalOpen, setIsSettledModalOpen] = useState(false);
  // 경고 모달 타입 (수정 시도인지 삭제 시도인지)
  const [settledModalType, setSettledModalType] = useState<'edit' | 'delete'>('edit');

  const handleDelete = async () => {
    await deleteExpense(tripId, expenseId);
    queryClient.invalidateQueries({
      queryKey: ['tripBudget', tripId],
    });
    queryClient.refetchQueries({
      queryKey: ['tripBudget', tripId],
    });
    setIsDeleteModalOpen(false);
    router.push(`/trip/${tripId}/budget`);
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    if (!canAddExpense) {
      setSettledModalType('edit');
      setIsSettledModalOpen(true);
      return;
    }
    router.push(`/trip/${tripId}/budget/expense/edit?expenseId=${expenseId}`);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (!canAddExpense) {
      setSettledModalType('delete');
      setIsSettledModalOpen(true);
      return;
    }
    setIsDeleteModalOpen(true);
  };

  return (
    <header className="flex items-center justify-between px-5 py-3">
      <Link href={`/trip/${tripId}/budget`}>
        <Image src={arrowLeft} alt="back button" />
      </Link>

      <div className="flex items-center space-x-4 text-body-1">
        <button className="cursor-pointer" onClick={handleEditClick}>
          수정
        </button>
        <button className="cursor-pointer text-status_error" onClick={handleDeleteClick}>
          삭제
        </button>
      </div>
      {/* 삭제 확인 모달 */}
      <DeleteExpenseModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      {/* 정산된 내역 경고 모달 */}
      <SettledExpenseModal
        isOpen={isSettledModalOpen}
        onClose={() => setIsSettledModalOpen(false)}
        type={settledModalType}
      />
    </header>
  );
}
