pipeline {
    agent any
    triggers { pollSCM('H/5 * * * *') }
    environment {
        REGISTRY = "localhost:8083"
        IMAGE_DICTIONARY = "UniDep"
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
        TELEGRAM_CHAT_ID='1098197545'
    }

    stages {
        stage('Init') {
            steps {
                script { currentBuild.displayName = "#${BUILD_NUMBER}" }
                script { env.CURRENT_STAGE = 'Init' }
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
                stage('Build Backend Image') {
                    steps {
                        script { env.CURRENT_STAGE = 'Build Backend Image' }
                        dir('FastApi') {
                            sh 'docker build -t ${IMAGE_BACK} .'
                        }
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        script { env.CURRENT_STAGE = 'Build Frontend Image' }
                        dir('idz-unidep-front-app') {
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
            when {
                anyOf {
                    branch 'master'
                    branch 'dev'
                }
            }
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
                def stage = env.STAGE_NAME ?: 'Unknown'
                def msg = "❌ Jenkins pipeline failed in *${env.CURRENT_STAGE}* (branch: ${env.BRANCH_NAME})"
                if (msg?.trim()) {
                    sh """
                        curl -s -X POST https://api.telegram.org/bot${TELEGRAM_API}/sendMessage \\
                            -d chat_id=${TELEGRAM_CHAT_ID} \\
                            -d parse_mode=Markdown \\
                            -d text="${msg}"
                    """
                } else {
                    echo "⚠️ Telegram message text is empty. Not sending."
                }
                echo '❌ Build or push failed.'
            }
        }
        success {
            script {
                def msg = "✅ Jenkins pipeline completed successfully for ${env.BRANCH_NAME}"
                if (msg?.trim()) {
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
}
