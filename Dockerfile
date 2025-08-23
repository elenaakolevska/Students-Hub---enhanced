FROM eclipse-temurin:24-jdk

WORKDIR /app

# Copy the JAR file
COPY target/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]