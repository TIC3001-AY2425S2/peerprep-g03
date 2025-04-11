export const isMatch = (a, b, queueType) => {
    switch(queueType) {
        case 'exact_matches':
            return a.topic === b.topic && a.difficulty === b.difficulty;
        case 'topic_matches':
            return a.topic === b.topic;
        case 'difficulty_matches':
            return a.difficulty === b.difficulty;
        default:
            return false;
    }
};

export const createMessage = (userId, criteria) => ({
    userId,
    ...criteria
});