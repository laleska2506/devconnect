import { IsString, IsArray, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  bio?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @IsNumber()
  @Min(0)
  @IsOptional()
  hourlyRate?: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;
}

