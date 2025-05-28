# Stage 1: Build a multi-stage build, using a JDK to build the application
FROM openjdk:17-jdk-slim-bullseye AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the Spring Boot application (this creates the JAR file)
RUN mvn clean package -DskipTests

# Stage 2: Create the final image with just the JRE for a smaller image size
FROM openjdk:17-jre-slim-bullseye

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the 'build' stage
# Replace 'your-application-name-0.0.1-SNAPSHOT.jar' with your actual JAR file name
COPY --from=build /app/target/MaintenanceErrorReportingSystem-1.0-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot application runs on (default is 8080)
EXPOSE 8080

# Command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]