import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";
import privateInstance from "@/lib/api/instance/privateInstance";
import { GetMyFaceDto } from "../types/face-dto-type";

export const getMyFaceData = async (): Promise<GetMyFaceDto> => {
    try {
        const res = await privateInstance.get<ApiEnvelope<GetMyFaceDto>>(apiPath.face);
        return res.data.data;
    } catch (error) {
        console.log('getMyFaceData API 실패', error);
        throw new Error('여행 예산 정보를 불러오는 데 실패했습니다.');
    }
};