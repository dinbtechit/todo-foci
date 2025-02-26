import {AppDataSource} from "@/db/db";
import {User} from "@/db/entities/user";
import {FindOneOptions} from "typeorm";


export async function registerUser(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    const newUser = userRepository.create({email});
    await userRepository.save(newUser);
    return newUser;
}

export async function getUserByEmail(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({where: {email}});
}

export async function getUserById(id: string) {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({id} as FindOneOptions<User>);
}