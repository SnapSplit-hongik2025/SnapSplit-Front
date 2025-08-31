import { Member } from "@/shared/types/member";
import { SettlementDetailDto } from "./settlement-dto-type";

export interface SettlementPageProps{
    tripId: string;
    settlementId: string;
    startDay?: number | null;
    endDay?: number | null;
}

export interface SettlementHeaderProps {
    tripId: string;
}

export interface SettlementInfoSectionProps {
    members?: Member[];
    startDay?: number;
    endDay?: number;
    SettlementDetailDto?: SettlementDetailDto[];
}

export interface SettlementFlowCardProps {
    className?: string;
    SettlementDetailDto?: SettlementDetailDto[];
    type?: 'send' | 'receive';
}