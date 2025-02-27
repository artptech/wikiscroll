import { render } from 'preact';

import './style.css';
import { useRandomArticle } from './hooks/useRandomArticle';
import { Article } from './services/article/schemas';
import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import { ArticleView } from './components/ArticleView';

type AppState = {
	articles: Article[];
}

export function App() {
	const articleContainer = useRef<HTMLDivElement>(null);
	const [state, setState] = useState<AppState>({
		articles: [],
	});

	const { article, refetchArticle, isFetching } = useRandomArticle();

	useEffect(() => {
		console.log('refetching article');
		refetchArticle();
	}, []);

	const refetchIfTouching = useCallback(() => {
		const isTouching = window.scrollY + window.innerHeight >= articleContainer.current?.clientHeight;

		if (isTouching && !isFetching) {
			refetchArticle();
		}
	}, [refetchArticle, articleContainer.current, isFetching]);

	useEffect(() => {
		if (!article) {
			return;
		}

		setState({
			articles: [...state.articles, article],
		});

		refetchIfTouching();
	}, [article?.id, articleContainer.current]);

	useEffect(() => {
		const scrollListener = () => {
			refetchIfTouching();
		}

		window.addEventListener('scroll', scrollListener);

		return () => {
			window.removeEventListener('scroll', scrollListener);
		}
	}, [refetchIfTouching]);

	// ToDo:
	// - Add a map component
	// - Use an async generator to fetch articles
	// - Build infinite scroll
	return (
		<div id="article-container" ref={articleContainer}>
			{
				state.articles.map((article) => (
					<ArticleView article={article} />
				))
			}
		</div>
	);
}

render(<App />, document.getElementById('app'));
