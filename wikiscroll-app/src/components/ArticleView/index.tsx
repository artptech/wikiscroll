import { Article } from "../../services/article/schemas";

type Props = {
	article: Article;
}

export const ArticleView = ({ article }: Props) => {
	const fullHeight = window.innerHeight;
	return (<div style={{ height: fullHeight }}>
		<img width={300} src={article.images.original} alt={article.title} />
		<h1>{article.title}</h1>
		<p style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>{article.description}</p>
		<div dangerouslySetInnerHTML={{ __html: article.body }} />
		{
			article.article_type === 'Location' && (
				<div>
					<h5>Location</h5>
					<p>{article.coordinates?.latitude}, {article.coordinates?.longitude}</p>
				</div>
			)
		}
	</div>
	);
};
