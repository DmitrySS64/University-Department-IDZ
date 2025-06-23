pipeline {
    agent any
    triggers { pollSCM('H/5 * * * *') }
    environment {
        REGISTRY = "localhost:8083"
        IMAGE_NAME_FRONT = "idz-unidep-front"
        IMAGE_NAME_BACK = "idz-unidep-back"
        IMAGE_TAG = "latest"
        SONARQUBE_PROJECT_BACK = 'consultant-back'
        SONARQUBE_PROJECT_FRONT = 'consultant-front'
        SONAR_HOST_URL = "http://localhost:9000"
        SONAR_TOKEN = credentials('sonar_token')
        NEXUS_CREDENTIALS_ID = 'nexus_jenkins'
        TELEGRAM_API=credentials('telegram_bot_api')
        TELEGRAM_CHAT_ID='1098197545'
    }

    stages {
        stage('Init') {
            steps {
                script {
                    if (env.BRANCH_NAME == 'master') {
                        env.ENVIRONMENT = 'prod'
                    } else if (env.BRANCH_NAME == 'stage') {
                        env.ENVIRONMENT = 'stage'
                    } else {
                        env.ENVIRONMENT = 'dev'
                    }
                    echo "🔧 Окружение: ${env.ENVIRONMENT}"
                }
            }
        }
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            parallel {
                stage('Backend Analysis') {
                    steps {
                        withSonarQubeEnv("${SONARQUBE_SERVER}") {
                            dir('FastApi') {
                                sh 'sonar-scanner -Dproject.settings=../sonar-project.backend.properties'
                            }
                        }
                    }
                }

                stage('Frontend Analysis') {
                    steps {
                        withSonarQubeEnv("${SONARQUBE_SERVER}") {
                            dir('idz-unidep-front-app') {
                                sh 'sonar-scanner -Dproject.settings=../sonar-project.frontend.properties'
                            }
                        }
                    }
                }
            }
        }
        stage('Build Docker Image') {
            parallel {
                stage('Build Backend Image') {
                    steps {
                        dir('FastApi') {
                            sh 'docker build -t backend .'
                        }
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        dir('idz-unidep-front-app') {
                            sh 'docker build -t nginx .'
                        }
                    }
                }
            }
        }
        stage('Trivy Scan') {
            parallel {
                stage('Scan Backend') {
                    steps {
                        sh 'trivy image --exit-code 1 backend || true'
                    }
                }
                stage('Scan Frontend') {
                    steps {
                        sh 'trivy image --exit-code 1 nginx || true'
                    }
                }
            }
        }

        stage('Push to Registry') {
            when {
                anyOf {
                    branch 'main'
                    branch 'dev'
                }
            }
            steps {
                script {
                    withCredentials([
                        usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                    ]) {
                        sh '''
                            echo "$PASSWORD" | docker login ${REGISTRY} -u "$USERNAME" --password-stdin

                            docker tag backend ${REGISTRY}/consultant-platform/backend:${params.ENVIRONMENT}
                            docker push ${REGISTRY}/consultant-platform/backend:${params.ENVIRONMENT}

                            docker tag nginx ${REGISTRY}/consultant-platform/nginx:${params.ENVIRONMENT}
                            docker push ${REGISTRY}/consultant-platform/nginx:${params.ENVIRONMENT}
                        '''
                    }
                }
            }
        }
        stage("Deploy"){
            when {
                branch 'master'
            }
            steps {
                echo "🚀 Deploying to production"
                sshagent(credentials: ['ssh_to_deploy_server']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no jenkins@192.168.1.38 '
                            docker pull $REGISTRY/$IMAGE:$TAG && 
                            docker stop $IMAGE || true && 
                            docker rm $IMAGE || true && 
                            docker run -d --name $IMAGE -p 8000:8000 192.168.1.40:8083/$IMAGE:$TAG
                        '
                    """
                }
            }
        }
    }

    post {
        failure {
            script {
                def msg = "❌ Jenkins pipeline failed in *${env.STAGE_NAME}* (${env.BRANCH_NAME})"
                sh """
                    curl -s -X POST https://api.telegram.org/bot${TELEGRAM_API}/sendMessage \\
                        -d chat_id=${TELEGRAM_CHAT_ID} \\
                        -d parse_mode=Markdown \\
                        -d text="${msg}"
                """
            }
            echo '❌ Build or push failed.'
        }
        success {
            script {
                def msg = "✅ Jenkins pipeline completed successfully for ${env.BRANCH_NAME}"
                sh """
                    curl -s -X POST https://api.telegram.org/bot${TELEGRAM_API}/sendMessage \\
                        -d chat_id=${TELEGRAM_CHAT_ID} \\
                        -d parse_mode=Markdown \\
                        -d text="${msg}"
                """
            }
            echo "✅ Pipeline completed successfully for ${env.BRANCH_NAME}"
        }
    }
}
