import privateInstance from "./instance/privateInstance";

export const expenseInitData = async (tripId: string) => {
    try {
        const res = await privateInstance.get(`/trip/${tripId}/expense/new`);
        return res.data;
    } catch (error) {
        console.error("지출 초기화 데이터 가져오기 실패 : ", error);
        throw error;
    }
};