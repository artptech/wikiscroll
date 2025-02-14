use serde_json::json;

use crate::models::{Article, ArticleCoordinates, ArticleImages, ArticleType};

pub fn parse_wikipedia_random_article_schema(json: serde_json::Value) -> Article {
    let original_coordinates = json["coordinates"].as_object();

    let coordinates = match original_coordinates {
        Some(coordinates) => {
            Some(ArticleCoordinates {
                latitude: coordinates["lat"].as_f64().unwrap(),
                longitude: coordinates["lon"].as_f64().unwrap(),
            })
        }
        None => None,
    };

    let is_location = coordinates.is_some();

    Article {
        id: json["pageid"].as_i64().unwrap(),
        title: json["title"].as_str().unwrap().to_string(),
        body: json["extract"].as_str().unwrap().to_string(),
        images: ArticleImages {
            original: json["originalimage"]["source"].as_str().unwrap().to_string(),
            thumbnail: json["thumbnail"]["source"].as_str().unwrap().to_string(),
        },
        description: json["description"].as_str().unwrap().to_string(),
        coordinates: coordinates,
        article_type: if is_location { ArticleType::Location } else { ArticleType::Other },
    }
}

pub fn validate_wikipedia_random_article_schema(json: serde_json::Value) -> bool {
    let schema = json!({
        "type": "object",
        "properties": {
            "type": { "type": "string" },
            "title": { "type": "string" },
            "displaytitle": { "type": "string" },
            "namespace": {
                "type": "object",
                "properties": {
                    "id": { "type": "integer" },
                    "text": { "type": "string" }
                }
            },
            "wikibase_item": { "type": "string" },
            "titles": {
                "type": "object",
                "properties": {
                    "canonical": { "type": "string" },
                    "normalized": { "type": "string" },
                    "display": { "type": "string" }
                }
            },
            "pageid": { "type": "integer" },
            "thumbnail": {
                "type": "object",
                "properties": {
                    "source": { "type": "string" },
                    "width": { "type": "integer" },
                    "height": { "type": "integer" }
                }
            },
            "originalimage": {
                "type": "object",
                "properties": {
                    "source": { "type": "string" },
                    "width": { "type": "integer" },
                    "height": { "type": "integer" }
                }
            },
            "lang": { "type": "string" },
            "dir": { "type": "string" },
            "revision": { "type": "string" },
            "tid": { "type": "string" },
            "timestamp": { "type": "string" },
            "description": { "type": "string" },
            "description_source": { "type": "string" },
            "content_urls": {
                "type": "object",
                "properties": {
                    "desktop": {
                        "type": "object",
                        "properties": {
                            "page": { "type": "string" },
                            "revisions": { "type": "string" },
                            "edit": { "type": "string" },
                            "talk": { "type": "string" }
                        }
                    },
                    "mobile": {
                        "type": "object",
                        "properties": {
                            "page": { "type": "string" },
                            "revisions": { "type": "string" },
                            "edit": { "type": "string" },
                            "talk": { "type": "string" }
                        }
                    }
                }
            },
            "coordinates": {
                "type": "object",
                "properties": {
                    "lat": { "type": "number" },
                    "lon": { "type": "number" }
                }
            },
            "extract": { "type": "string" },
            "extract_html": { "type": "string" }
        }
    });

    let validation_result = jsonschema::is_valid(&schema, &json);
    validation_result
}
