export const sanitizeObject = <T>(object: T, allowedKeys: (keyof T)[]) => {
    if (!object) return {};

    const keys = Object.keys(object) as (keyof T)[];

    // Iterate over keys and check if key is not in list
    keys.forEach((k) => {
        // Remove the key from object
        if (!allowedKeys.includes(k)) {
            delete object[k];
        }
    });

    return object;
};
