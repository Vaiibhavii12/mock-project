# Step 1: Use a base image
FROM openjdk:17-jdk-slim

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy the .jar file from the local target directory to the container
ADD target/Mock_Interview_Project-0.0.1-SNAPSHOT.jar /app/app.jar

# Step 4: Expose the port your Spring Boot app will run on
EXPOSE 8080

# Step 5: Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
