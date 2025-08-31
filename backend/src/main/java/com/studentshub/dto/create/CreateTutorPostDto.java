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
        TutorPost tutorPost = new TutorPost(
                tutorName,
                faculty,
                worksOnline,
                price,
                subject,
                owner
        );
        tutorPost.setTitle(title);
        tutorPost.setDescription(description);
        return tutorPost;
    }
}
