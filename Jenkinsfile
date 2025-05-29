pipeline {
    agent any

    environment {
        REGISTRY = "localhost:8083"
        IMAGE_NAME = "idz-unidep-front"
        IMAGE_TAG = "latest"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    sh """
                    docker compose down
                    docker compose build
                    docker compose up -d
                    """
                }
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Run tests here (currently empty)...'
                // Add test commands when needed
            }
        }

        stage('Tag & Push to Nexus') {
            steps {
                script {
                    def fullImage = "${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

                    sh """
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${fullImage}
                        docker push ${fullImage}
                    """
                }
            }
        }
    }

    post {
        failure {
            echo '❌ Build or push failed.'
        }
        success {
            echo '✅ Successfully built and pushed image to Nexus!'
        }
    }
}
