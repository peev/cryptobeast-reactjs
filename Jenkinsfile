node {
  try {
    def commit_id

    stage('Preparation') {
      checkout scm
      sh 'git rev-parse --short HEAD > .git/commit-id'
      commit_id = readFile('.git/commit-id').trim()
    }

    stage('Install Dependencies') {
      nodejs(nodeJSInstallationName: 'nodejs') {
        sh 'cd client && npm install'
        sh 'cd server && npm install'
      }
    }

    // stage('Test Front-End') {
    //   nodejs(nodeJSInstallationName: 'nodejs') {
    //     sh 'cd client && npm run test:ci'
    //   }
    // }

    stage('Build Front-End Static Bundle') {
      nodejs(nodeJSInstallationName: 'nodejs') {
        sh 'cd client && npm run build:demo'
      }
    }

    stage('Deploy Front-End') {
      if (env.BRANCH_NAME == "refactored") {
        sh 'scp -i ~/.ssh/id_rsa -r .client/build/* ubuntu@ip-172-31-35-186:/var/www/cryptobeast'
      }
      if (env.BRANCH_NAME == "weibeast") {
        sh 'scp -i ~/.ssh/id_rsa -r client/build/* ubuntu@ip-172-31-35-186:/var/www/weibeast'
      }
      if (env.BRANCH_NAME == "weibeast-production") {
        sh 'scp -i ~/.ssh/id_rsa -r client/build/* ubuntu@3.122.88.91:/var/www/cryptobeast.motion-software.com'
      }
    }

    stage('Deploy Back-End') {
      if (env.BRANCH_NAME == "refactored") {
        sh 'ssh ubuntu@ip-172-31-35-186 "cd crypto-deploy && bash buildanddeploy.sh"'
      }
      if (env.BRANCH_NAME == "weibeast") {
        sh 'ssh ubuntu@ip-172-31-35-186 "cd weibeast-deploy && bash buildanddeploy.sh"'
      }
      if (env.BRANCH_NAME == "weibeast-production") {
        withCredentials([
          string(credentialsId: 'weibeast_aws_rds_hostname', variable: 'DBHOST'),
          string(credentialsId: 'weibeast_aws_rds_username', variable: 'DBUSER'),
          string(credentialsId: 'weibeast_aws_rds_password', variable: 'DBPASS'),
        ]) {
          def DBPORT = 5432
          def DBNAME = "weibeast"

          def apiEnv = """
            DBHOST=${DBHOST}
            DBPORT=${DBPORT}
            DBNAME=${DBNAME}
            DBUSER=${DBUSER}
            DBPASS=${DBPASS}
          """

          sh "echo -e '${apiEnv}' >> .env && scp .env ubuntu@3.122.88.91:/home/ubuntu/weibeast-deploy"
          sh 'ssh ubuntu@3.122.88.91 "cd weibeast-deploy && bash buildanddeploy.sh"'
          sh 'rm .env'
        }
      }
    }

    stage('Remove Dependencies') {
      // Ensure deps are deleted to save space
      // This will save us 1GB of storage on each build
      sh 'cd client && rm -rf node_modules/'
      sh 'cd server && rm -rf node_modules/'
    }

    // slackSend(color: '#4BB543', message: "JOB: '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL}), BRANCH: '${env.BRANCH_NAME}' COMMIT-ID: '${commit_id}'")
  } catch(e) {
    // slackSend(color: '#FF0000', message: "JOB: '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL}), BRANCH: '${env.BRANCH_NAME}' COMMIT-ID: '${commit_id}'")
    currentBuild.result = "FAILURE";
    throw e;
  }
}
