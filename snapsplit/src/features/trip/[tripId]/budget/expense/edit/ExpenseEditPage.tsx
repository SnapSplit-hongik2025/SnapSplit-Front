import EditHeader from './_components/EditHeader';
import ExpenseEditForm from './ExpenseEditForm';

export default function ExpenseEditPage() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <EditHeader />
      <ExpenseEditForm />
    </div>
  );
};
