import { Article, ArticleSchema } from "./schemas";

const API_URL = 'http://localhost:8000';

export const fetchRandomArticle = async (): Promise<Article> => {
    const response = await fetch(`${API_URL}/api/random`);
    const data = await response.json();

    return ArticleSchema.parse(data.body.Article);
};

