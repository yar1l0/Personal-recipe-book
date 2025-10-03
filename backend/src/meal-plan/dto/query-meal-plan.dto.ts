import { IsDateString } from 'class-validator';

export class QueryMealPlanDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}