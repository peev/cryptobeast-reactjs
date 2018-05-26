node {
  try {
    def commit_id
    def out
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
    stage('Test Front-End') {
      nodejs(nodeJSInstallationName: 'nodejs') {
        sh 'cd client && npm run test:ci'
      }
    }
    stage('Build Front-End Static Bundle') {
      nodejs(nodeJSInstallationName: 'nodejs') {
        sh 'cd client && npm run build'
      }
    }
    stage('Deploy Front-End') {
      sh 'cp -a client/build/. /var/www/cryptobeast/'
    }
    stage('Deploy Back-End') {
      // #1 Remove old image
      try {
        sh 'docker rmi crb-server'
      } catch(imageError) {
        out.println "Container: crb-server does not exist"
      }
      // #2 Build a new image
      sh 'docker build -t crb-server .'
      // #3 Run the new image
      sh 'docker run -d -p 3200:3200 --net="host" --restart unless-stopped --name crb-server crb-server'
    }
  } catch(e) {
    currentBuild.result = "FAILURE";
    throw e;
  }
}
