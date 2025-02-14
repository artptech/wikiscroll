// use crate::schema::posts;
use rocket::serde::{Serialize};

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub enum ArticleType {
    Location,
    Other,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ArticleImages {
    pub original: String,
    pub thumbnail: String,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct ArticleCoordinates {
    pub latitude: f64,
    pub longitude: f64,
}

#[derive(Serialize)]
#[serde(crate = "rocket::serde")]
pub struct Article {
    pub id: i64,
    pub title: String,
    pub body: String,
    pub images: ArticleImages,
    pub description: String,
    // Coordinates may be none
    pub coordinates: Option<ArticleCoordinates>,
    pub article_type: ArticleType,
}
