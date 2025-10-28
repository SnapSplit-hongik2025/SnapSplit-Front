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
        throw new Error('나의 얼굴 정보를 가져오는데 실패했습니다.');
    }
};

export const postMyFace = async (): Promise<null> => {
    try {
        await privateInstance.post<ApiEnvelope<null>>(apiPath.face);
        return null;
    } catch (error) {
        console.log('postMyFace API 실패', error);
        throw new Error('나의 얼굴 등록을 실패했습니다.');
    }
};