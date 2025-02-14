// api/src/bin/main.rs

#[macro_use] extern crate rocket;
use api::article_handler;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/api", routes![
            article_handler::list_random_article_handler, 
            article_handler::list_article_handler,
        ])
}