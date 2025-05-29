pipeline {
    agent {
        docker {
            image 'docker:24.0-cli'  // клиент Docker v24
            //image 'benhall/dind-jenkins-agent:v2'
            args '-v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    environment {
        REGISTRY = "localhost:8083"
        IMAGE_NAME_FRONT = "idz-unidep-front"
        IMAGE_NAME_BACK = "idz-unidep-back"
        IMAGE_NAME_NGINX = "idz-unidep-nginx"
        IMAGE_NAME_DB = "idz-unidep-db"
        IMAGE_TAG = "latest"
        NEXUS_CREDENTIALS_ID = "4c48b307-fbd3-482e-8739-3259c173d9f4"
        NEXUS_USER = "jenkins"
        NEXUS_PASS = "jenkins"
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
                withCredentials([usernamePassword(credentialsId: {NEXUS_CREDENTIALS_ID}, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                    sh """
                        echo "🏷️ Тэггирование и пуш"
                        docker login -u ${NEXUS_USER} -p ${NEXUS_PASS} ${REGISTRY}
                        docker tag ${IMAGE_NAME_FRONT} ${REGISTRY}/${IMAGE_NAME_FRONT}:${IMAGE_TAG}
                        docker push ${REGISTRY}/${IMAGE_NAME_FRONT}:${IMAGE_TAG}
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
