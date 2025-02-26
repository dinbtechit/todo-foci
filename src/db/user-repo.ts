import {AppDataSource} from "@/db/db";
import {User} from "@/db/entities/user";


export async function registerUser(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    const newUser = userRepository.create({email: email.toLowerCase()});
    await userRepository.save(newUser);
    return newUser;
}

export async function getUserByEmail(email: string) {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({where: {email}});
}

export async function getUserById(id: string) {
    const userRepository = AppDataSource.getRepository(User);
    return userRepository.findOne({where: {id}});
}