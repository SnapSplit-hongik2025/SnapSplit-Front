import devider from '@public/svg/devider.svg';
import Image from 'next/image';
import { TripInfoProps } from '../type';

const TripInfo = ({ tripName, countries, memberCount, startDate, endDate }: TripInfoProps) => {
  return (
    <div className="flex flex-col px-5 gap-2 pt-2 pb-4">
      <div className="flex flex-row space-x-3 items-center">
        <p className="text-grey-850 text-head-0">{tripName}</p>
        <div className="flex space-x-1">
          {countries.map(({ countryId, countryName }) => (
            <div key={countryId} className="flex px-3 py-[2px] rounded-[20px] text-body-2 text-grey-850 bg-white">
              {countryName}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row space-x-2 items-center text-grey-650">
        <p className="text-body-2">{memberCount}명</p>
        <Image alt="|" src={devider} />
        <p className="text-body-2">
          {startDate} - {endDate}
        </p>
      </div>
    </div>
  );
};

export default TripInfo;
