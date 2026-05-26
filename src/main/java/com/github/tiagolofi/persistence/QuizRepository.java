package com.github.tiagolofi.persistence;

import java.util.List;

import io.quarkus.mongodb.panache.PanacheMongoRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class QuizRepository implements PanacheMongoRepository<Quiz> {
    
    public List<String> getCategories() {
        return listAll()
            .stream()
            .map(Quiz::category)
            .distinct()
            .toList();
    }

    public List<Quiz> findByCategory(String category) {
        return list("category", category);
    }

}
