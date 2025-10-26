'use client';

import InputTripNameSection from '@/shared/components/steps/Step4_InputTripName';
import { EditNamePageProps } from './type';

import mock from '@public/mocks/edit-name-mock.json';
import { useState } from 'react';

const EditNamePage = ({ tripId }: EditNamePageProps) => {
  console.log('- tripId: ' + tripId);

  const [tripName, setTripName] = useState<string>('');
  const [tripImageUrl, setTripImageUrl] = useState<string | null>(null);
  const [tripImageFile, setTripImageFile] = useState<File | null>(null);

  console.log('- tripName: ' + tripName);
  console.log('- tripImageUrl: ' + tripImageUrl);
  console.log('- tripImageFile: ' + tripImageFile);

  return (
    <InputTripNameSection
      tripName={mock.data.tripName}
      tripImageUrl={mock.data.tripImage}
      onClick={() => {
        /* api 호출 */
      }}
      variant="edit"
      setTripName={setTripName}
      setTripImageUrl={setTripImageUrl}
      setTripImageFile={setTripImageFile}
    />
  );
};

export default EditNamePage;
