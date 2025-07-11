import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
	@ApiProperty({
		description: 'The refresh token to be used for refreshing the session',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	@IsString()
	@IsNotEmpty()
	refresh_token: string;
}
