import { IsDateString } from 'class-validator';

export class GenerateShoppingListDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}