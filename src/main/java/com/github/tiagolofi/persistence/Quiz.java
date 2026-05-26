package com.github.tiagolofi.persistence;

import io.quarkus.mongodb.panache.common.MongoEntity;

@MongoEntity(collection = "quizzes")
public record Quiz (
    String question,
    String answer,
    String level,
    String category,
    Integer value
) {}
