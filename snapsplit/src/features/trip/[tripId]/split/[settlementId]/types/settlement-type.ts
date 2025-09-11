import { Member } from "@/shared/types/member";
import { SettlementDetailDto } from "./settlement-dto-type";

export interface SettlementPageProps{
    tripId: string;
    settlementId: string;
    startDay?: number;
    endDay?: number;
}

export interface SettlementHeaderProps {
    tripId: string;
}

export interface SettlementInfoSectionProps {
    members?: Member[];
    startDay?: number;
    endDay?: number;
    settlementDetails?: SettlementDetailDto[];
}

export interface SettlementFlowCardProps {
    className?: string;
    settlementDetails?: SettlementDetailDto[];
    type?: 'send' | 'receive';
}