export const userRoles = {
    Admin: 'Admin',
    User: 'User',
};

export const otpGenerate = async () =>
    Math.floor(100000 + Math.random() * 900000);
export const availableExtensions = ['.pdf', '.doc', '.docx'];