import { Injectable } from '@nestjs/common';
import { IUserRepository } from '@modules/user/domain/ports/repositories/user.repository';
import { User } from '@modules/user/domain/entities/user.entity';
import { Model } from 'mongoose';
import { UserMapper } from '@modules/user/infrastructure/mappers/user.mapper';
import {
	UserDocument,
	UserModel,
} from '@modules/user/infrastructure/adapters/persistence/schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoUserRepository implements IUserRepository {
	constructor(
		@InjectModel(UserModel.name)
		private readonly userModel: Model<UserDocument>,
	) {}

	async save(user: User): Promise<void> {
		const userDoc = UserMapper.toPersistenceCreate(user);
		await this.userModel.create(userDoc);
	}

	async findByEmail(email: string): Promise<User | null> {
		const userDoc = await this.userModel.findOne({ email }).exec();
		return userDoc ? UserMapper.toDomain(userDoc) : null;
	}

	async findById(id: string): Promise<User | null> {
		const userDoc = await this.userModel.findById(id).exec();
		return userDoc ? UserMapper.toDomain(userDoc) : null;
	}

	async findByIdWithFollowers(userId: string): Promise<User[] | null> {
		const userDoc = await this.userModel
			.findById(userId)
			.populate({
				path: 'followers',
				select: 'name avatar email',
			})
			.exec();
		if (!userDoc) {
			return null;
		}
		return userDoc.followers.map((follower) =>
			UserMapper.toDomain(follower as unknown as UserDocument),
		);
	}

	async findByIdWithFollowings(userId: string): Promise<User[] | null> {
		const userDoc = await this.userModel
			.findById(userId)
			.populate({
				path: 'followings',
				select: 'name avatar email',
			})
			.exec();
		if (!userDoc) {
			return null;
		}
		return userDoc.followings.map((following) =>
			UserMapper.toDomain(following as unknown as UserDocument),
		);
	}

	async createUserIfNotExists(
		email: string,
		name: string,
		avatar?: string,
	): Promise<User> {
		const existingUser = await this.userModel.findOne({ email }).exec();
		if (existingUser) {
			return UserMapper.toDomain(existingUser);
		}

		const newUser = new this.userModel({
			email,
			name,
			avatar,
		});

		const savedUser = await newUser.save();
		return UserMapper.toDomain(savedUser);
	}

	update(user: Partial<User>): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
