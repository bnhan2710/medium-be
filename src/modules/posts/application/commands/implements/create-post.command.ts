import { ICommand } from '@nestjs/cqrs';
export class CreatePostCommand implements ICommand {
	constructor(
		public readonly title: string,
		public readonly content: string,
		public readonly tags: string[],
		public readonly authorId: string,
	) {}
}
