import privateInstance from "./instance/privateInstance";

export const expenseInitData = async (tripId: string) => {
    try {
        const res = await privateInstance.get(`/trip/${tripId}/expense/new`);
        return res.data;
    } catch (error) {
        throw error;
    }
};