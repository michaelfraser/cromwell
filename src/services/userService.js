import User from '../models/userModel.js';

export async function getUserService(id) {
    const user = await User.findById(id);
    return user;
}
