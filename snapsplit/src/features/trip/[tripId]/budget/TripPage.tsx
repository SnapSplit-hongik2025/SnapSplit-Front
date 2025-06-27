// import BottomNavBar from '@/shared/components/BottomNavBar';
// import TripInfo from './_components/TripInfo';
// import DailyExpenseList from './_components/DailyExpenseList';
// import ExpenseFilter from './_components/ExpenseFilter';
// import SharedBudgetBar from './_components/SharedBudgetBar';
// import TripDateBar from './_components/TripDateBar';
// import TripHeader from './_components/TripHeader';
// import BottomSheetTrigger from './_components/modal/BottomSheetTrigger';

// export default async function TripPage({ tripId }: { tripId: string }) {
//   console.log(tripId);

//   // 테스트 데이터
//   const countries = [
//     { countryId: 1, countryName: '런던' },
//     { countryId: 2, countryName: '파리' },
//     { countryId: 3, countryName: '취리히' },
//   ];

//   const totalShared = [
//     {
//       totalSharedCurrency: 'KRW',
//       totalSharedAmount: 300000,
//     },
//     {
//       totalSharedCurrency: 'USD',
//       totalSharedAmount: 120.5,
//     },
//   ];

//   const expenses = [
//     {
//       expenseId: 1,
//       expenseDate: '2025-04-01',
//       expenseAmount: 215000,
//       expenseCurrency: 'KRW',
//       expenseUsers: [
//         { userId: 11, userName: '유빈' },
//         { userId: 12, userName: '나경' },
//       ],
//       expenseCategory: '항공권',
//     },
//     {
//       expenseId: 5,
//       expenseDate: '2025-04-01',
//       expenseAmount: 1000,
//       expenseCurrency: 'EUR',
//       expenseUsers: [
//         { userId: 11, userName: '유빈' },
//         { userId: 11, userName: '나경' },
//         { userId: 11, userName: '지수' },
//         { userId: 11, userName: '연수' },
//       ],
//       expenseCategory: '런던 숙소',
//     },
//     {
//       expenseId: 2,
//       expenseDate: '2025-04-07',
//       expenseAmount: 36,
//       expenseCurrency: 'EUR',
//       expenseUsers: [
//         { userId: 11, userName: '유빈' },
//         { userId: 11, userName: '나경' },
//         { userId: 11, userName: '지수' },
//       ],
//       expenseCategory: '점심',
//     },
//     {
//       expenseId: 3,
//       expenseDate: '2025-04-8',
//       expenseAmount: 10000,
//       expenseCurrency: 'USD',
//       expenseUsers: [{ userId: 13, userName: '지수' }],
//       expenseCategory: '백화점',
//     },
//   ];

//   return (
//     <div className="h-screen flex flex-col">
//       <div className="bg-grey-350">
//         <TripHeader />
//         <TripInfo
//           tripName={'유luv여행'}
//           countries={countries}
//           memberCount={4}
//           startDate={'2025.4.7'}
//           endDate={'4.12'}
//         />
//         <SharedBudgetBar totalShared={totalShared} />
//         <TripDateBar startDate="2025-04-07" endDate="2025-04-16" />
//       </div>
//       <ExpenseFilter />
//       <DailyExpenseList expenses={expenses} tripStartDate="2025-04-07" tripEndDate="2025-04-16" />
//       <BottomSheetTrigger total={1355200} />
//       <BottomNavBar />
//     </div>
//   );
// }
