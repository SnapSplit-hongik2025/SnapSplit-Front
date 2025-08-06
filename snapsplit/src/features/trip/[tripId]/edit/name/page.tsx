'use client';

import InputTripNameSection from '@/shared/components/steps/Step4_InputTripName';
import { EditNamePageProps } from './type';

import mock from '@public/mocks/edit-name-mock.json';

const EditNamePage = ({ tripId }: EditNamePageProps) => {
  console.log('- tripId: ' + tripId);

  return (
    <InputTripNameSection
      tripName={mock.data.tripName}
      tripImage={mock.data.tripImage}
      onClick={() => {
        /* api 호출 */
      }}
      variant="edit"
    />
  );
};

export default EditNamePage;
