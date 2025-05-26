# ----- Build Fázis -----
# Ebben a fázisban építjük meg a JAR fájlt.
FROM maven:3.9.5-eclipse-temurin-17 AS builder

# Állítsuk be a munkakönyvtárat a konténeren belül
WORKDIR /app

# Másoljuk be a pom.xml fájlt először, hogy a Maven fel tudja oldani a függőségeket
# Ezt külön lépésben tesszük, mert ha a pom.xml nem változik, a Docker cache-elheti ezt a lépést.
COPY pom.xml .

# Másoljuk be a teljes forráskódot
COPY src ./src

# Futtassuk a Maven build parancsot.
# -DskipTests kihagyja a teszteket a gyorsabb build érdekében.
RUN mvn clean install -DskipTests

# ----- Futtatás Fázis -----
# Ebben a fázisban a végleges, könnyű JRE image-et használjuk a JAR futtatásához.
# Ezzel kisebb lesz a végleges Docker image mérete.
FROM eclipse-temurin:17-jre-focal

# Állítsuk be a munkakönyvtárat
WORKDIR /app

# Másoljuk be a build fázisból az elkészült JAR fájlt.
# A *.jar wildcard segít, ha a JAR neve tartalmaz verziószámot, vagy timestamp-et.
COPY --from=builder /app/target/*.jar app.jar

# Deklaráljuk a portot, amin az alkalmazás figyelni fog.
# Ez nem teszi ki a portot a külvilág felé, csak dokumentálja.
# A Render a környezeti változókat használja a tényleges port kiosztására.
EXPOSE 10000

# Ez a parancs fut le, amikor a konténer elindul.
CMD ["java", "-jar", "app.jar"]