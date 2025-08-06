import SpendHeader from './_components/SpendHeader';
import SpendForm from './_components/SpendForm';

const SpendPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <SpendHeader />
      <SpendForm />
    </div>
  );
};

export default SpendPage;
