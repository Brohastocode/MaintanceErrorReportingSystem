# Stage 1: Build a multi-stage build, using a JDK to build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build the Spring Boot application (this creates the JAR file)
RUN mvn clean package -DskipTests

# Stage 2: Create the final image with just the JRE for a smaller image size
FROM eclipse-temurin:17-jre

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the 'build' stage
# Fontos: ellenőrizd a JAR fájl pontos nevét!
COPY --from=build /app/target/MaintenanceErrorReportingSystem-1.0-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot application runs on (default is 8080)
EXPOSE 8080

# Command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]