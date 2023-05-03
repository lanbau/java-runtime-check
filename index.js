/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
const parse = require('xml-parser'); 

// JavaScript
const common = require("oci-common");
// Using default configurations
const provider = new common.ConfigFileAuthenticationDetailsProvider();
const jms = require("oci-jms")

const OWNER = 'lanbau'
const REPO = 'sample-java-project'
const PATH = 'pom.xml'

module.exports = (app) => {
  app.log.info("Yay, the app was loaded!");

  app.on('push', async (context) => {
    app.log.info({ event: context.name, action: context.payload.action });

    try {
      
      context.octokit.rest.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: PATH,
      }).then(res => {
        const pomData = atob(res.data.content)
        const obj = parse(pomData);
        const javaVersion = obj.root.children[7].children[5].content
        const client = new jms.JavaManagementServiceClient({ authenticationDetailsProvider: provider });
    
        (async () => {
          try {
            // Create a request and dependent object(s).
            const getJavaReleaseRequest = {
              releaseVersion: javaVersion,
              opcRequestId: "GMT4UEGUMOLHIUHPFJNG123"
            };
      
            // Send request to the Client.
            const getJavaReleaseResponse = await client.getJavaRelease(getJavaReleaseRequest);
           
            console.log(getJavaReleaseResponse)
            context.octokit.rest.issues.create({
              owner: OWNER,
              repo: REPO,
              title: javaVersion + ' Security Baseline: ' + getJavaReleaseResponse.javaRelease.securityStatus ,
              body: `<ul>
                <li>Release version: ${getJavaReleaseResponse.javaRelease.releaseVersion}</li>
                <li>Family version: ${getJavaReleaseResponse.javaRelease.familyVersion}</li>
                <li>Parent release version: ${getJavaReleaseResponse.javaRelease.parentReleaseVersion}</li>
                <li>License type: ${getJavaReleaseResponse.javaRelease.licenseType}</li>
                <li>Release date: ${getJavaReleaseResponse.javaRelease.releaseDate}</li>
                <li>Release notes URL: ${getJavaReleaseResponse.javaRelease.releaseNotesUrl}</li>
              </ul>`
            });
          } catch (error) {
            console.log("getJavaRelease Failed with error  " + error);
          }
        })();
      })
    } catch (err) {
      console.log(err)
    }
  });

};
