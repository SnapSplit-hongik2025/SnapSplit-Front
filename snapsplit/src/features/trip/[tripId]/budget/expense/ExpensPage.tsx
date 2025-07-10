'use client';

import { useParams } from "next/navigation";
import ExpenseForm from "@/features/trip/[tripId]/budget/expense/_components/ExpenseForm";

const postExpense = (formData: FormData) => {
  // TODO: API 호출
  console.log(formData);
}

const ExpensePage = () => {
    const { mode } = useParams() as {mode: 'add' | 'remove'}

  return (
    <ExpenseForm mode={mode} onSubmit={postExpense} />
  );
};

export default ExpensePage;