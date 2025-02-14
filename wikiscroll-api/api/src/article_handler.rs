use shared::response_models::{Response, ResponseBody};
use application::article::{read};
use domain::models::{Article};
use rocket::{get};
use rocket::response::status::{NotFound};

#[get("/random")]
pub async fn list_random_article_handler() -> String {
    let article: Result<Article, NotFound<String>> = read::list_random_article().await;
    let response = Response { body: ResponseBody::Article(article.unwrap()) };
    serde_json::to_string(&response).unwrap()
}

#[get("/article/<article_id>")]
pub fn list_article_handler(article_id: i32) -> Result<String, NotFound<String>> {
    todo!()
}