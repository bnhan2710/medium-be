import { Injectable } from '@nestjs/common';
import { IPostRepository } from '@modules/posts/domain/port/repositories/post.repository';
import { Post } from '@modules/posts/domain/entities/post.entity';
import { PostMapper } from '@modules/posts/infrastructure/mappers/post.mapper';
import {
	PostDocument,
	PostModel,
} from '@modules/posts/infrastructure/adapters/persistence/schemas/post.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OffsetPagination } from '@shared/common/dtos';
import { IPageRequest } from '@shared/common/types';

@Injectable()
export class MongoPostRepository implements IPostRepository {
	constructor(
		@InjectModel(PostModel.name)
		private readonly postModel: Model<PostDocument>,
	) {}

	async findById(postId: string): Promise<Post | null> {
		const postDoc = await this.postModel.findById(postId).exec();
		return postDoc ? PostMapper.toDomain(postDoc) : null;
	}

	async findByUserId(userId: string, pageRequest: IPageRequest): Promise<Post[]> {
		const { size, offset } = pageRequest;

		const postsDocs = await this.postModel
			.find({ author: new Types.ObjectId(userId) })
			.skip(offset)
			.limit(size)
			.exec();
		return postsDocs.map(PostMapper.toDomain);
	}

	async save(post: Post): Promise<string> {
		const postDoc = PostMapper.toPersistence(post);
		const createdPost = await this.postModel.create(postDoc);
		return (createdPost._id as any).toString();
	}

	async update(post: Post): Promise<string> {
		const postDoc = PostMapper.toPersistenceUpdate(post);
		const postId = post.getId().getValue();

		await this.postModel.updateOne({ _id: postId }, postDoc).exec();

		return postId;
	}

	async delete(postId: string): Promise<void> {
		await this.postModel.deleteOne({ _id: postId }).exec();
	}
}
