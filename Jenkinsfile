pipeline {
    agent {
        docker {
            image 'docker:24.0-cli'  // клиент Docker v24
            //image 'benhall/dind-jenkins-agent:v2'
        }
    }

    environment {
        REGISTRY = "localhost:8083"
        IMAGE_NAME_FRONT = "idz-unidep-front"
        IMAGE_NAME_BACK = "idz-unidep-back"
        //IMAGE_NAME_NGINX = "idz-unidep-nginx"
        //IMAGE_NAME_DB = "idz-unidep-db"
        IMAGE_TAG = "latest"
        NEXUS_CREDENTIALS_ID = 'nexus_jenkins'
    }

    stages {
        //stage('Checkout') {
        //    steps {
        //        checkout scm
        //    }
        //}

        stage('Build') {
            steps {
                script {
                    sh "docker compose build"
                }
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Run tests here (currently empty)...'
                // Add test commands when needed
                script {
                    sh """
                        docker compose up -d

                        docker compose down
                    """
                }
            }
        }

        stage('Tag & Push to Nexus') {
            steps {
                script {
                    withCredentials([
                        usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                    ]) {
                        //echo "$PASSWORD" | docker login ${REGISTRY} -u "$USERNAME" --password-stdin 
                    sh """
                        docker tag ${IMAGE_NAME_FRONT} ${REGISTRY}/${IMAGE_NAME_FRONT}:${IMAGE_TAG}
                        docker push ${REGISTRY}/${IMAGE_NAME_FRONT}:${IMAGE_TAG}

                        docker tag ${IMAGE_NAME_BACK} ${REGISTRY}/${IMAGE_NAME_BACK}:${IMAGE_TAG}
                        docker push ${REGISTRY}/${IMAGE_NAME_BACK}:${IMAGE_TAG}
                        """
                    }
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
