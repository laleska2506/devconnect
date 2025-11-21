import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  budgetMin: number;

  @IsNumber()
  @Min(0)
  budgetMax: number;
}

