// fetches a new random article every time the scroll is at the bottom of the page

import { useCallback, useEffect, useState } from "preact/hooks";
import { Queries } from "../services/article";
import { Article } from "../services/article/schemas";

type HookState = {
    article: Article | null;
    isFetching: boolean;
    refetchArticle: () => void;
}

export const useRandomArticle = () => {
    const [state, setState] = useState<HookState>({
        article: null,
        isFetching: false,
        refetchArticle: () => {},
    });

    const fetchRandomArticle = useCallback(() => {
        if (state.isFetching) {
            return;
        }

        setState({
            ...state,
            isFetching: true,
        });

        Queries.fetchRandomArticle().then(article => {
            setState({
                ...state,
                article,
                isFetching: false,
            });
        }).catch(console.error);
    }, [state.isFetching]);

    const refetchArticle = useCallback(() => {
        fetchRandomArticle();
    }, [fetchRandomArticle]);

    return {
        ...state,
        refetchArticle,
    };
};