package com.github.tiagolofi.rest;

import java.net.URI;
import java.util.List;

import org.jboss.resteasy.reactive.RestPath;

import com.github.tiagolofi.persistence.Quiz;
import com.github.tiagolofi.persistence.QuizRepository;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

@RequestScoped
@Path("/quizzes")
public class QuizRest {
    
    @Inject
    QuizRepository quizRepository;

    @POST
    @Path("/new")
    public Response addQuestion(Quiz quiz) {
        try {
            quizRepository.persist(quiz);
            return Response.status(Status.CREATED)
                .location(URI.create("/quizzes/list/" + quiz.category()))
                .build();
        } catch (Exception e) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GET
    @Path("/categories")
    public List<String> getCategories() {
        return quizRepository.getCategories();
    }

    @GET
    @Path("/list/{category}")
    public Response listQuizzes(@RestPath String category) {
        if (category == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        List<Quiz> quizzes = quizRepository.findByCategory(category);
        return Response.status(Status.OK)
            .entity(quizzes)
            .build();
    }

}
