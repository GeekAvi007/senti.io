import Sentiment from 'sentiment'
import db from './db/index.js'

const sentiment = new Sentiment();

const classifySentiment = score => {
    if(score > 1) return 'POSITIVE';
    if(score < 0) return 'NEGATIVE';
    return 'NEUTRAL';
};

export const processReviewSentiment = async (review_id, review_text) => {
    const result = sentiment.analyze(review_text);
    const status = classifySentiment(result.score);

    const updateQuery = 'UPDATE reviews SET status = $1 WHERE id = $2';

    await db.query(updateQuery, [status, review_id]);
}