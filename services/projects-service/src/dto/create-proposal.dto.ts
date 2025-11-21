import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateProposalDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsNumber()
  @Min(0)
  amount: number;
}

