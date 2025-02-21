// fetches a new random article every time the scroll is at the bottom of the page

import { useCallback, useEffect, useState } from "preact/hooks";
import { Queries } from "../services/article";
import { Article } from "../services/article/schemas";

export const useRandomArticle = () => {
    const [article, setArticle] = useState<Article | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const fetchRandomArticle = useCallback(() => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);
        Queries.fetchRandomArticle().then(setArticle).catch(console.error).finally(() => setIsFetching(false));
    }, [setIsFetching]);

    const refetchArticle = useCallback(() => {
        fetchRandomArticle();
    }, [fetchRandomArticle]);

    useEffect(() => {
        fetchRandomArticle();
    }, [fetchRandomArticle]);

    return {
        article,
        refetchArticle,
        isFetching,
    };
};