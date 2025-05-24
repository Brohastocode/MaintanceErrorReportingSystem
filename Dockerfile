# Alap image: Eclipse Temurin JDK 17
FROM eclipse-temurin:17-jdk AS build

# Alkalmazás mappája
WORKDIR /app

# Maven wrapper és a projektfájlok bemásolása
COPY . .

# Build (skipTests -> gyorsabb)
RUN ./mvnw clean install -DskipTests

# ------------------------
# Második szakasz: csak a futtatáshoz szükséges dolgokat tartalmazza
FROM eclipse-temurin:17-jdk

# Alkalmazás mappája a végső image-ben
WORKDIR /app

# JAR fájl bemásolása az előző fázisból
COPY --from=build /app/target/MaintenanceErrorReportingSystem-1.0-SNAPSHOT.jar app.jar

# Alkalmazás indítása
ENTRYPOINT ["java", "-jar", "app.jar"]
