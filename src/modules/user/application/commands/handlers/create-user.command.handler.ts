import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../implements/create-user.command';
import { IUserRepository } from '@modules/user/domain/ports/repositories/user.repository';
import { User } from '@modules/user/domain/entities/user.entity';
import { UserAlreadyExistsError } from '@modules/user/domain/exceptions/user-already-exists.error';
import { Inject } from '@nestjs/common';
import { USER_TOKENS } from '@modules/user/user.tokens';
@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
	constructor(
		@Inject(USER_TOKENS.USER_REPOSITORY)
		private readonly userRepository: IUserRepository,
	) {}

	async execute(command: CreateUserCommand): Promise<void> {
		const { email, name, avatar } = command;

		const existingUser = await this.userRepository.findByEmail(email);
		if (existingUser) {
			throw new UserAlreadyExistsError(email);
		}

		const user = User.create({
			email,
			name,
			avatar,
		});

		await this.userRepository.save(user);
	}
}
