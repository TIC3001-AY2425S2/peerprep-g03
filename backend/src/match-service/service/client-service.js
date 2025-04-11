import axios from 'axios';

const QUESTION_SERVICE_URL = process.env.QUESTION_SERVICE_URL || 'http://localhost:4000';

export async function getRandomQuestion(topic, difficulty) {
    try {
        const params = {
            complexity: difficulty,
            categories: Array.isArray(topic) ? topic.join(',') : topic
        };

        const response = await axios.get(`${QUESTION_SERVICE_URL}/api/questions/random`, {
            params,
            timeout: 5000
        });
        console.info(`Question service response: ${JSON.stringify(response.data)}`);

        if (!response.data.success || !response.data.data?._id) {
            console.error('Invalid response from question service');
        }
        console.log(`Data: ${response.data.data._id}` );
        return response.data.data._id;

    } catch (error) {
        console.error(`Question service error: ${error.message}`);
    }
}