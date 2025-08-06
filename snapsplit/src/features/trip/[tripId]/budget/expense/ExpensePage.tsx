import ExpenseHeader from './_components/ExpenseHeader';
import ExpenseForm from './_components/ExpenseForm';

const ExpensePage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <ExpenseHeader />
      <ExpenseForm />
    </div>
  );
};

export default ExpensePage;
