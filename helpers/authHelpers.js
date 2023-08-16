import bcrypt from 'bcryptjs'

export const hashPassword = async (password) => {
    try {
        const saltRounds = 5;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword
    } catch (err) {
        console.log("Error in hashing password", err)
    }
}

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}