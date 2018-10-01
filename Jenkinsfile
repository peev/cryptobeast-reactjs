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
        sh 'scp -i ~/.ssh/id_rsa -r client/build/. ubuntu@ip-172-31-35-186:/var/www/cryptobeast'
      }
    }

    stage('Deploy Back-End') {
      if (env.BRANCH_NAME == "refactored") {
        sh 'ssh ubuntu@ip-172-31-35-186 "cd crypto-deploy && bash buildanddeploy.sh"'
      }
    }

    // slackSend(color: '#4BB543', message: "JOB: '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL}), BRANCH: '${env.BRANCH_NAME}' COMMIT-ID: '${commit_id}'")
  } catch(e) {
    // slackSend(color: '#FF0000', message: "JOB: '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL}), BRANCH: '${env.BRANCH_NAME}' COMMIT-ID: '${commit_id}'")
    currentBuild.result = "FAILURE";
    throw e;
  }
}
