export const useLocalStorage = (key: string) => {
    const setItem = (value: string) => {
        try {
            window.localStorage.setItem(key, value);
        } catch (e) {
            console.error(e);
        }
    };

    const getItem = (): string | null => {
        try {
            return window.localStorage.getItem(key);
        } catch (e) {
            console.error(e);
            return null;
        }
    };

    const removeItem = () => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error("localStorage removeItem error:", error);
        }
    };

    return { setItem, getItem, removeItem };
};