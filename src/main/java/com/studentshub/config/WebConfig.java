package com.studentshub.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

//@Configuration
//public class WebConfig implements WebMvcConfigurer {
//
//    @Value("${materials.upload-dir:materialUploads}")
//    private String materialsUploadDir;
//
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        registry.addResourceHandler("/uploads/**")
//                .addResourceLocations("file:" + Paths.get("uploads").toAbsolutePath().toUri().toString())
//                .setCachePeriod(0);
//
//        String materialsPath = Paths.get(materialsUploadDir).toAbsolutePath().toString();
//        registry.addResourceHandler("/files/**")
//                .addResourceLocations("file:" + materialsPath + "/")
//                .setCachePeriod(0);
//    }
//}

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String uploadPath = Paths.get(uploadDir).toAbsolutePath().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/")
                .setCachePeriod(0);
    }
}