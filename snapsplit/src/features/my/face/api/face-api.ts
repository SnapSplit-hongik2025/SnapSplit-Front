import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";
import privateInstance from "@/lib/api/instance/privateInstance";
import { GetMyFaceDto } from "../types/face-dto-type";

export const getMyFaceData = async (): Promise<GetMyFaceDto> => {
    try {
        const res = await privateInstance.get<ApiEnvelope<GetMyFaceDto>>(apiPath.my_face);
        return res.data.data;
    } catch (error) {
        console.log('getMyFaceData API 실패', error);
        throw new Error('나의 얼굴 정보를 가져오는데 실패했습니다.');
    }
};

export const postMyFace = async (imageFile: File): Promise<null> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        await privateInstance.post<ApiEnvelope<null>>(apiPath.snap_face,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
        return null;
    } catch (error) {
        console.log('postMyFace API 실패', error);
        throw new Error('나의 얼굴 등록을 실패했습니다.');
    }
};

export const putMyFace = async (imageFile: File): Promise<null> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        await privateInstance.put<ApiEnvelope<null>>(apiPath.snap_face, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
        return null;
    } catch (error) {
        console.log('putMyFace API 실패', error);
        throw new Error('나의 얼굴 수정을 실패했습니다.');
    }
};