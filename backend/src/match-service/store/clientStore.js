const createClientStore = () => {
    const clients = new Map();

    return{
        get: (userId) => clients.get(userId),
        set: (userId, ws) => {
            clients.set(userId, ws);
            return clients;
        },
        delete : (userId) => clients.delete(userId),
        has: (userId) => clients.has(userId)
    };
};

const clientStore = createClientStore();
export default clientStore;