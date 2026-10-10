# Multi-stage Dockerfile for Spring Boot backend (Root build context)
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src
ENV MAVEN_OPTS="-Xmx384m -XX:+TieredCompilation -XX:TieredStopAtLevel=1"
RUN mvn clean package -DskipTests --no-transfer-progress -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENV PORT=8080
ENV JAVA_OPTS="-Xmx384m -Xms128m -XX:+UseG1GC"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
