import { ApiEnvelope } from "@/lib/api/type";
import { apiPath } from "@/shared/constants/apipath";
import privateInstance from "@/lib/api/instance/privateInstance";
import { GetMyFaceDto } from "../types/face-dto-type";

export const getMyFaceData = async (): Promise<GetMyFaceDto> => {
    try {
        const res = await privateInstance.get<ApiEnvelope<GetMyFaceDto>>(apiPath.my_face);
        if (!res.data.success) {
            throw new Error(res.data.message || '나의 얼굴 정보를 가져오는데 실패했습니다.');
        }
        return res.data.data;
    } catch (error) {
        console.error('getMyFaceData API 실패', error);
        throw new Error('나의 얼굴 정보를 가져오는데 실패했습니다.');
    }
};

export const postMyFace = async (imageFile: File): Promise<null> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const res = await privateInstance.post<ApiEnvelope<null>>(apiPath.snap_face,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        });
        if (!res.data.success) {
            throw new Error(res.data.message || '나의 얼굴 등록에 실패했습니다.');
        }
        return null;
    } catch (error) {
        console.error('postMyFace API 실패', error);
        throw new Error('나의 얼굴 등록에 실패했습니다.');
    }
};

export const putMyFace = async (imageFile: File): Promise<null> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const res = await privateInstance.put<ApiEnvelope<null>>(apiPath.snap_face, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        });
        if (!res.data.success) {
            throw new Error(res.data.message || '나의 얼굴 등록에 실패했습니다.');
        }
        return null;
    } catch (error) {
        console.error('putMyFace API 실패', error);
        throw new Error('나의 얼굴 수정에 실패했습니다.');
    }
};