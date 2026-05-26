package com.github.tiagolofi.web;

import io.quarkus.qute.CheckedTemplate;
import io.quarkus.qute.TemplateInstance;
import jakarta.enterprise.context.RequestScoped;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

@RequestScoped
@Path("/quiz-factory")
public class QuestionFlow {
    
    @CheckedTemplate(requireTypeSafeExpressions = false)
    public static class Templates {
        public static native TemplateInstance questionFlow();
    }

    @GET
    @Path("/question-flow")
    @Produces(MediaType.TEXT_HTML)
    public TemplateInstance questionFlow() {
        return Templates.questionFlow();
    }

}
