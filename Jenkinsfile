pipeline {

    agent any

    environment {
        AWS_REGION = "us-east-1"

        ECR_BACKEND = "food-backend"
        ECR_FRONTEND = "food-frontend"
        ECR_ADMIN = "food-admin"

        SONAR_HOST = "http://44.211.8.134:9000"
    }


    stages {


        stage('Checkout Code') {
            steps {
                echo "Cloning source code"

                git branch: 'main',
                url: 'https://github.com/YOUR_USERNAME/food-delivery-devsecops-project.git'
            }
        }



        stage('Project Structure') {
            steps {
                sh '''
                echo "========== PROJECT =========="
                ls -la

                echo "========== DIRECTORIES =========="
                find . -maxdepth 2 -type d
                '''
            }
        }



        stage('Backend Install') {
            steps {
                sh '''
                cd backend

                npm install

                echo "Backend dependencies installed"
                '''
            }
        }



        stage('Frontend Install') {
            steps {
                sh '''
                cd frontend

                npm install

                echo "Frontend dependencies installed"
                '''
            }
        }



        stage('Admin Install') {
            steps {
                sh '''
                cd admin

                npm install

                echo "Admin dependencies installed"
                '''
            }
        }



        stage('SonarQube Scan') {
            steps {
                echo "Running SonarQube analysis"

                sh '''
                sonar-scanner \
                -Dsonar.projectKey=food-delivery \
                -Dsonar.sources=. \
                -Dsonar.host.url=${SONAR_HOST}
                '''
            }
        }



        stage('Trivy File Scan') {

            steps {

                sh '''
                echo "Scanning filesystem"

                trivy fs \
                --severity HIGH,CRITICAL \
                --exit-code 0 .
                '''
            }
        }



        stage('Docker Build') {

            steps {

                sh '''

                echo "Building Docker images"


                docker build \
                -t ${ECR_BACKEND}:latest \
                ./backend


                docker build \
                -t ${ECR_FRONTEND}:latest \
                ./frontend


                docker build \
                -t ${ECR_ADMIN}:latest \
                ./admin


                docker images

                '''
            }
        }



        stage('Docker Security Scan') {

            steps {

                sh '''

                trivy image \
                --severity HIGH,CRITICAL \
                ${ECR_BACKEND}:latest


                trivy image \
                --severity HIGH,CRITICAL \
                ${ECR_FRONTEND}:latest


                trivy image \
                --severity HIGH,CRITICAL \
                ${ECR_ADMIN}:latest

                '''
            }
        }



        stage('AWS Login') {

            steps {

                sh '''

                aws sts get-caller-identity


                aws ecr get-login-password \
                --region ${AWS_REGION} \
                | docker login \
                --username AWS \
                --password-stdin \
                $(aws sts get-caller-identity --query Account --output text).dkr.ecr.${AWS_REGION}.amazonaws.com

                '''
            }
        }



        stage('Push Images To ECR') {

            steps {

                sh '''

                ACCOUNT=$(aws sts get-caller-identity --query Account --output text)


                REGISTRY=$ACCOUNT.dkr.ecr.${AWS_REGION}.amazonaws.com



                docker tag ${ECR_BACKEND}:latest \
                $REGISTRY/${ECR_BACKEND}:latest


                docker tag ${ECR_FRONTEND}:latest \
                $REGISTRY/${ECR_FRONTEND}:latest


                docker tag ${ECR_ADMIN}:latest \
                $REGISTRY/${ECR_ADMIN}:latest



                docker push $REGISTRY/${ECR_BACKEND}:latest

                docker push $REGISTRY/${ECR_FRONTEND}:latest

                docker push $REGISTRY/${ECR_ADMIN}:latest

                '''
            }
        }



        stage('Deploy To EKS') {

            steps {

                sh '''

                aws eks update-kubeconfig \
                --region ${AWS_REGION} \
                --name food-delivery-cluster



                kubectl get nodes


                kubectl apply -f k8s/


                kubectl get pods -A

                '''
            }
        }

    }



    post {

        success {

            echo "================================="
            echo " BUILD SUCCESSFUL "
            echo " Application deployed to EKS "
            echo "================================="
        }


        failure {

            echo "BUILD FAILED - Check Jenkins logs"
        }
    }

}
