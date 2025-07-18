import { Module } from '@nestjs/common';
import { PostController } from './presentation/http/controllers/post.controller';
import { POST_TOKENS } from './post.tokens';
import { MongoPostRepository } from './infrastructure/adapters/persistence/mongodb/mongo-post.repository';
import {
	PostSchema,
	PostModel,
} from './infrastructure/adapters/persistence/schemas/post.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatePostCommandHandler } from './application/commands/handlers/create-post.command-handler';
import { GetPostDetailQueryHandler } from './application/queries/handlers/get-post-detail.query-handler';
import { GetUserPostQueryHandler } from './application/queries/handlers/get-user-post.query-handler';
import { UpdatePostCommandHandler } from './application/commands/handlers/update-post.command-handler';
import { DeletePostCommandHandler } from './application/commands/handlers/delete-post.command';

const CommandHandlers = [
	CreatePostCommandHandler,
	UpdatePostCommandHandler,
	DeletePostCommandHandler,
];

const QueryHandlers = [GetPostDetailQueryHandler, GetUserPostQueryHandler];

const Repositories = [
	{
		provide: POST_TOKENS.POST_REPOSITORY,
		useClass: MongoPostRepository,
	},
];

@Module({
	imports: [MongooseModule.forFeature([{ name: PostModel.name, schema: PostSchema }])],
	providers: [
		...CommandHandlers,
		...QueryHandlers,
		...Repositories,
		MongoPostRepository,
	],
	exports: [...Repositories, MongoPostRepository],
	controllers: [PostController],
})
export class PostModule {}
