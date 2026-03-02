import * as UserRepository from '../repositories/user.repository';
export async function getAllUsers() {
    const user = await UserRepository.getAll();
    
    if (!user) {
      console.log("No user found");
    }
} 