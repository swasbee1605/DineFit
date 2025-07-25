import { account } from '../appwriteClient';
export const forceLogout = async () => {
    try {
        console.log('🔄 Force logout: Clearing all sessions...');
        await account.deleteSessions();
        console.log('✅ All sessions cleared');
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    } catch (error) {
        console.log('⚠️ Session clear error (this is often normal):', error.message);
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    }
};
export const checkSessionConflict = async () => {
    try {
        const user = await account.get();
        return { hasSession: true, user };
    } catch (error) {
        if (error.message.includes('session') || error.code === 401) {
            return { hasSession: false, needsClear: true };
        }
        return { hasSession: false, needsClear: false };
    }
};
