package com.studentshub.dto.create;

import com.studentshub.model.InternshipPost;
import com.studentshub.model.User;

public record CreateInternshipPostDto(
        String title,
        String description,
        String company,
        String facultyFilter,
        String position,
        String logoUrl
) {
    public InternshipPost toInternshipPost(User owner) {
        InternshipPost post = new InternshipPost();
        post.setTitle(title);
        post.setDescription(description);
        post.setCompany(company);
        post.setFacultyFilter(facultyFilter);
        post.setPosition(position);
        post.setLogoUrl(logoUrl);
        post.setOwner(owner);
        return post;
    }
}
