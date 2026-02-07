FROM quay.io/quarkus/quarkus-micro-image:2.2
COPY target/*-runner.jar /work/application.jar
EXPOSE 8080
CMD ["java", "-jar", "/work/application.jar"]
