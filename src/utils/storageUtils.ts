import { toast } from "sonner"

const MAX_LOCAL_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB (typical localStorage limit)

export const checkStorageQuota = (dataToAdd: Record<string, unknown>): boolean => {
    try {
        // Calculate size of all existing data
        let totalSize = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                const value = localStorage.getItem(key);
                if (value) {
                    totalSize += new TextEncoder().encode(key).length + 
                                new TextEncoder().encode(value).length;
                }
            }
        }

        // Calculate size of new data
        const newDataSize = new TextEncoder().encode(JSON.stringify(dataToAdd)).length;
        
        // Log current storage usage
        console.log(`Current storage usage: ${totalSize} bytes`);
        console.log(`New data size: ${newDataSize} bytes`);
        console.log(`Storage limit: ${MAX_LOCAL_STORAGE_SIZE} bytes`);

        if (totalSize + newDataSize > MAX_LOCAL_STORAGE_SIZE) {
            toast.warning('Local storage is nearly full! Please backup and clear some data.');
            return false;
        }

        return true;
    } catch (e: unknown) {
        if ((e as Error).name === 'QuotaExceededError' || 
            (e as Error).message.includes('exceeded') || 
            (e as Error).message.includes('quota')) {
            toast.warning('Local storage is already full!');
            return false;
        }
        console.error('Storage check error:', e);
        return false;
    }
};

export const safeSetItem = (key: string, value: string): boolean => {
    try {
        const dataToStore = { [key]: value };
        if (!checkStorageQuota(dataToStore)) {
            return false;
        }

        localStorage.setItem(key, value);
        return true;
    } catch (e: unknown) {
        console.error('Error saving to localStorage:', e);
        toast.error('Failed to save data. Storage might be full.');
        return false;
    }
};

export const getStorageUsagePercentage = (): number => {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const value = localStorage.getItem(key);
            if (value) {
                totalSize += new TextEncoder().encode(key).length + 
                            new TextEncoder().encode(value).length;
            }
        }
    }
    return (totalSize / MAX_LOCAL_STORAGE_SIZE) * 100;
};
