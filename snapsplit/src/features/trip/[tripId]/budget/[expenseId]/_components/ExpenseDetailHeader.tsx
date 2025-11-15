'use client';

import Image from 'next/image';
import arrowLeft from '@public/svg/arrow-left-grey-1000.svg';
import Link from 'next/link';
import { useState } from 'react';
import DeleteExpenseModal from './modal/DeleteExpenseModal';
import { deleteExpense } from '../api/expense-detail';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface ExpenseDetailHeaderProps {
  tripId: string;
  expenseId: string;
}

export default function ExpenseDetailHeader({ tripId, expenseId }: ExpenseDetailHeaderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    await deleteExpense(tripId, expenseId);
    queryClient.invalidateQueries({
      queryKey: ['tripBudget', tripId],
    });
    queryClient.refetchQueries({
      queryKey: ['tripBudget', tripId],
    });
    setIsModalOpen(false);
    router.push(`/trip/${tripId}/budget`);
  };

  const navigateToEdit = () => {
    router.push(`/trip/${tripId}/budget/expense/edit?expenseId=${expenseId}`);
  };

  return (
    <header className="flex items-center justify-between px-5 py-3">
      <Link href={`/trip/${tripId}/budget`}>
        <Image src={arrowLeft} alt="back button" />
      </Link>

      <div className="flex items-center space-x-4 text-body-1">
        <button className="cursor-pointer" onClick={navigateToEdit}>수정</button>
        <button
          className="cursor-pointer text-status_error"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          삭제
        </button>
      </div>
      <DeleteExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleDelete} />
    </header>
  );
}
