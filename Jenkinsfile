pipeline {
    agent any
    triggers { pollSCM('H/5 * * * *') }
    environment {
        REGISTRY = "localhost:8083"
        IMAGE_DICTIONARY = "unidep"
        IMAGE_FRONT = "nginx"
        IMAGE_BACK = "backend"
        SONARQUBE_SERVER = "sonarqube"
        SONARSCANNER = "SonarScanner"
        SONARQUBE_PROJECT_BACK = "${IMAGE_DICTIONARY}-back"
        SONARQUBE_PROJECT_FRONT = "${IMAGE_DICTIONARY}-front"
        SONAR_HOST_URL = "http://localhost:9000"
        SONAR_TOKEN = credentials('sonar_token')
        NEXUS_CREDENTIALS_ID = 'nexus_jenkins'
        TELEGRAM_API=credentials('telegram_bot_api')
        TELEGRAM_CHAT_ID='-1002584032525'
        TELEGRAM_TOPIC_ID='2'
    }
    options {
        skipStagesAfterUnstable()
    }
    stages {
        stage('Validate Branch') {
            when {
                not {
                    anyOf {
                        branch 'dev'
                        branch 'master'
                    }
                }
            }
            steps {
                echo "⛔ Branch '${env.BRANCH_NAME}' is not allowed to run this pipeline."
                script { currentBuild.result = 'ABORTED' }
                error("Pipeline aborted: Unsupported branch '${env.BRANCH_NAME}'")
            }
        }
        stage('Init') {
            steps {
                script {
                    currentBuild.displayName = "#${BUILD_NUMBER}"
                    env.CURRENT_STAGE = 'Init'
                    env.ENVIRONMENT = env.BRANCH_NAME == 'master' ? 'stage' : 'dev'
                    env.BACKEND_PORT = env.ENVIRONMENT == 'prod' ? '8000' : (env.ENVIRONMENT == 'stage' ? '8002' : '8001')
                    env.FRONTEND_PORT = env.ENVIRONMENT == 'prod' ? '8080' : '8081'
                    env.API_URL = "http://localhost:${env.BACKEND_PORT}"
                    echo "🔧 Окружение: ${env.ENVIRONMENT}, порт: ${env.BACKEND_PORT}"
                }
            }
            
        }
        stage('Checkout') {
            steps {
                script { env.CURRENT_STAGE = 'Checkout' }
                checkout scm
            }
        }
        stage('SonarQube Analysis') {
            parallel {
                stage('Backend Analysis') {
                    environment {
                        scannerHome = tool "${SONARSCANNER}"
                    }
                    steps {
                        script { env.CURRENT_STAGE = 'Backend Analysis' }
                        withSonarQubeEnv(installationName: 'sonarqube') {
                            dir('FastApi') {
                                sh "${scannerHome}/bin/sonar-scanner -Dproject.settings=../sonar-project.backend.properties"
                            }
                        }
                    }
                }

                stage('Frontend Analysis') {
                    environment {
                        scannerHome = tool "${SONARSCANNER}"
                    }
                    steps {
                        script { env.CURRENT_STAGE = 'Frontend Analysis' }
                        withSonarQubeEnv(installationName: "${SONARQUBE_SERVER}") {
                            dir('idz-unidep-front-app') {
                                sh "${scannerHome}/bin/sonar-scanner -Dproject.settings=../sonar-project.frontend.properties"
                            }
                        }
                    }
                }
            }
        }
        stage('Build Docker Image') {
            parallel {
                stage('Backend') {
                    steps {
                        script { env.CURRENT_STAGE = 'Build Backend Image' }
                        dir('FastApi') {
                            sh 'docker build -t ${IMAGE_BACK} .'
                        }
                    }
                }

                stage('Frontend') {
                    steps {
                        script { env.CURRENT_STAGE = 'Build Frontend Image' }
                        dir('idz-unidep-front-app') {
                            echo "⚙️ API_URL for build: ${API_URL}"
                            sh "echo \"VITE_API_URL=${API_URL}\" > .env"
                            sh 'docker build -t ${IMAGE_FRONT} .'
                        }
                    }
                }
            }
        }
        stage('Trivy Scan') {
            parallel {
                stage('Scan Backend') {
                    steps {
                        script { env.CURRENT_STAGE = 'Scan Backend' }
                        sh 'trivy image --exit-code 1 ${IMAGE_BACK} || true'
                    }
                }
                stage('Scan Frontend') {
                    steps {
                        script { env.CURRENT_STAGE = 'Scan Frontend' }
                        sh 'trivy image --exit-code 1 ${IMAGE_FRONT} || true'
                    }
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    script { env.CURRENT_STAGE = 'Push to Registry' }
                    withCredentials([
                        usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')
                    ]) {
                        sh '''
                            echo "$PASSWORD" | docker login ${REGISTRY} -u "$USERNAME" --password-stdin

                            docker tag ${IMAGE_BACK} ${REGISTRY}/${IMAGE_DICTIONARY}/${IMAGE_BACK}:${ENVIRONMENT}
                            docker push ${REGISTRY}/${IMAGE_DICTIONARY}/${IMAGE_BACK}:${ENVIRONMENT}

                            docker tag ${IMAGE_FRONT} ${REGISTRY}/${IMAGE_DICTIONARY}/${IMAGE_FRONT}:${ENVIRONMENT}
                            docker push ${REGISTRY}/${IMAGE_DICTIONARY}/${IMAGE_FRONT}:${ENVIRONMENT}
                        '''
                    }
                }
            }
        }
        stage("Deploy") {
            steps {
                script { env.CURRENT_STAGE = 'Deploy to Production' }
                echo "🚀 Deploying ${ENVIRONMENT}"

                sh """
                    docker pull ${REGISTRY}/${IMAGE_DICTIONARY}/${IMAGE_BACK}:${ENVIRONMENT}
                    docker stop ${IMAGE_BACK}_${ENVIRONMENT} || true
                    docker rm ${IMAGE_BACK}_${ENVIRONMENT} || true
                    docker run -d --name ${IMAGE_BACK}_${ENVIRONMENT} -p ${BACKEND_PORT}:8000 ${REGISTRY}/${IMAGE_DICTIONARY}/${IMAGE_BACK}:${ENVIRONMENT}

                    docker pull ${REGISTRY}/${IMAGE_DICTIONARY}/${IMAGE_FRONT}:${ENVIRONMENT}
                    docker stop ${IMAGE_FRONT}_${ENVIRONMENT} || true
                    docker rm ${IMAGE_FRONT}_${ENVIRONMENT} || true
                    docker run -d --name ${IMAGE_FRONT}_${ENVIRONMENT} -p ${FRONTEND_PORT}:80 ${REGISTRY}/${IMAGE_DICTIONARY}/${IMAGE_FRONT}:${ENVIRONMENT}
                """
                //sshagent(credentials: ['ssh_to_deploy_server']) {
                //    sh """
                //        ssh -o StrictHostKeyChecking=no jenkins@192.168.1.38 '
                //            docker pull $REGISTRY/$IMAGE:$TAG && 
                //            docker stop $IMAGE || true && 
                //            docker rm $IMAGE || true && 
                //            docker run -d --name $IMAGE -p 8000:8000 $REGISTRY/$IMAGE:$TAG
                //        '
                //    """
                //}
            }
        }
    }

    post {
        failure {
            script {
                def stage = env.STAGE_NAME ?: 'Unknown'
                def msg = "❌ Jenkins pipeline *${env.JOB_NAME}* failed in *${env.CURRENT_STAGE}* (branch: ${env.BRANCH_NAME})"
                if (msg?.trim()) {
                    sh """
                        curl -s -X POST \
                            -H 'Content-Type: application/json' \
                            -d '{
                                "chat_id": "${TELEGRAM_CHAT_ID}",
                                "message_thread_id": "${TELEGRAM_TOPIC_ID}",
                                "text": "${msg}",
                                "parse_mode": " Markdown",
                                "disable_notification": true
                            }' \
                            https://api.telegram.org/bot${TELEGRAM_API}/sendMessage
                    """
                } else {
                    echo "⚠️ Telegram message text is empty. Not sending."
                }
                echo '❌ Build or push failed.'
            }
        }
        success {
            script {
                def msg = "✅ Jenkins pipeline *${env.JOB_NAME}* completed successfully for ${env.BRANCH_NAME}"
                if (msg?.trim()) {
                    sh """
                        curl -s -X POST \
                            -H 'Content-Type: application/json' \
                            -d '{
                                "chat_id": "${TELEGRAM_CHAT_ID}",
                                "message_thread_id": "${TELEGRAM_TOPIC_ID}",
                                "text": "${msg}",
                                "parse_mode": " Markdown",
                                "disable_notification": true
                            }' \
                            https://api.telegram.org/bot${TELEGRAM_API}/sendMessage
                    """
                }
                echo "✅ Pipeline completed successfully for ${env.BRANCH_NAME}"
            }
        }
    }
}
