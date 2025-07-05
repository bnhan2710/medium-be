import { UserEntity } from "../../entities/user.entity";

export interface IUserRepository { 
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    save(user: UserEntity): Promise<void>;
    createUserIfNotExists(email: string, name: string, avatar?: string): Promise<UserEntity>;
}