node {
  try {
    def commit_id
    def out
    // def mailRecipients = "liubomir.markov@motionsoftware.eu,krasen.ilkov@motionsoftware.eu"
    def jobName = currentBuild.fullDisplayName

    stage('Preparation') {
      // Extract commit ID
      checkout scm
      sh 'git rev-parse --short HEAD > .git/commit-id'
      commit_id = readFile('.git/commit-id').trim()

      // Enable Console Output
      def config = new HashMap()
      def bindings = getBinding()
      config.putAll(bindings.getVariables())
      out = config['out']
    }
    stage('Install Dependencies') {
      // Ensure deps can be installed
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
      sh 'cp -a client/build/. /var/www/cryptobeast/'
    }
    stage('Deploy Back-End') {
      // #1 Remove old image
      try {
        sh 'docker stop cryptobeast'
        sh 'docker rm cryptobeast'
        sh 'docker rmi cryptobeast'
      } catch(imageError) {
        out.println "Container: cryptobeast does not exist"
      }
      // #2 Build a new image
      sh 'cd server && touch .env && docker build -t cryptobeast .'
      // #3 Run the new image
      sh 'docker run -d -p 3200:3200 --net="host" --restart on-failure --name cryptobeast cryptobeast'
    }

    // emailext body: '''${SCRIPT, template="groovy-html.template"}''',
    //     mimeType: 'text/html',
    //     subject: "[Jenkins] SUCCESS ${jobName}",
    //     to: "${mailRecipients}",
    //     replyTo: "${mailRecipients}",
    //     recipientProviders: [[$class: 'CulpritsRecipientProvider']]

  } catch(e) {

    // emailext body: '''${SCRIPT, template="groovy-html.template"}''',
    //     mimeType: 'text/html',
    //     subject: "[Jenkins] FAILURE ${jobName}",
    //     to: "${mailRecipients}",
    //     replyTo: "${mailRecipients}",
    //     recipientProviders: [[$class: 'CulpritsRecipientProvider']]

    currentBuild.result = "FAILURE";
    throw e;
  }
}
