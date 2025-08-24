package com.studentshub.dto.create;

import com.studentshub.model.TutorPost;
import com.studentshub.model.User;

public record CreateTutorPostDto(
        String title,
        String description,
        String tutorName,
        String faculty,
        boolean worksOnline,
        Integer price,
        String subject
) {
    public TutorPost toTutorPost(User owner) {
        return new TutorPost(
                tutorName,
                faculty,
                worksOnline,
                price,
                subject,
                owner
        );
    }
}
