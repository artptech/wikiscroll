// application/src/post/read.rs

use domain::models::{Article, ArticleImages, ArticleType};
use rocket::response::status::NotFound;

pub fn list_article(article_id: i32) -> Result<Article, NotFound<String>> {
    // use domain::schema::articles;

    // return result with none
    Ok(Article {
        id: 0,
        title: "".to_string(),
        body: "".to_string(),
        images: ArticleImages {
            original: "".to_string(),
            thumbnail: "".to_string(),
        },
        description: "".to_string(),
        coordinates: None,
        article_type: ArticleType::Other,
    })
}

pub async fn list_random_article() -> Result<Article, NotFound<String>> {
    let request_url = "https://en.wikipedia.org/api/rest_v1/page/random/summary";
    let response = reqwest::get(request_url).await;

    match response {
        Ok(response) => {
            let json: serde_json::Value = response.json().await.unwrap();
            let copy = json.clone();

            let validated = domain::schema::validate_wikipedia_random_article_schema(copy);
            println!("Validation result: {:?}", validated);

            if validated == true {
                // parses the json into an Article struct
                return Ok(domain::schema::parse_wikipedia_random_article_schema(json));
            } else {
                Err(NotFound("Failed to fetch random article".to_string()))
            }
        }
        Err(e) => {
            println!("Error: {:?}", e);
            return Err(NotFound("Failed to fetch random article".to_string()));
        }
    }
}

pub fn list_articles() -> Vec<Article> {
    // use domain::schema::articles;

    // return empty array
    vec![]
}
