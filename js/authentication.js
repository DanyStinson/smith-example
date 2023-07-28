document.addEventListener('DOMContentLoaded', function () {

    // Configure AWS region & define paramas
    var awsRegion = 'us-west-2';
    AWS.config.region = awsRegion;
    const clientId = "5ogo4t9c3l3hh7kp15irq5rdu4"
    const userPoolId = "us-west-2_VD52Xth6w"

    // Find Log-in and Game Containers
    const loginContainer = document.getElementById('login-container');
    const gameContainer = document.getElementById('game-container');

    // Function to show the game screen
    const showGame = (username) => {
        loginContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        //usernameSpan.textContent = username;
    };

  // Function to handle the login button click
  const handleLogin = () => {
    // Define Parameters
        const redirectUri = 'https://main.d375cwsx9dxbga.amplifyapp.com/index2.html'; // Should match the one used in the original authorization request
        const loginUrl = `https://smith-project.auth.us-west-2.amazoncognito.com/login?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    // Initiate the Cognito hosted UI login
    window.location.href = loginUrl;
  };

  // Check if there's a valid token code in the URL after login
  const urlParams = new URLSearchParams(window.location.hash);
  //const authorizationCode = urlParams.get('code');
  const id_token = urlParams.get('#id_token');
  const access_token = urlParams.get('access_token');
  const token_type = urlParams.get('token_type');
  const expires_in = urlParams.get('expires_in');


  const poolData = {
      UserPoolId: userPoolId,
      ClientId: clientId
    };

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      console.log('User is not logged in.');
    } else {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.error('Error getting Cognito session:', err);
        } else {
          const idToken = session.getIdToken().getJwtToken();
          const scopes = session.getIdToken().payload.scope;

          console.log(idToken);
          console.log(scopes);
        }
      });
    }



  function getCredentialsWithCognitoToken(cognitoAccessToken) {
      const credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-west-2:07898c51-aa23-4ac6-9a65-faea93d3ad91",
        Logins: {
          "cognito-idp.us-west-2.amazonaws.com/us-west-2_VD52Xth6w": cognitoAccessToken
        }
      });

      credentials.get((err) => {
        if (err) {
          console.error('Error retrieving AWS credentials:', err);
        } else {
          // Use the obtained credentials to make authenticated requests to AWS services
          showGame
          console.log("Logged In")
        }
      });
    }

  getCredentialsWithCognitoToken(id_token)

  // Function to handle the logout button click
  const handleLogout = () => {
    const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();
    cognitoIdentityServiceProvider.globalSignOut({}, function(err, data) {
      if (err) {
        console.error('Error logging out:', err);
      } else {
        // Clear any user session and redirect to the login page
        window.location.href = 'index.html';
      }
    });
  };

  // Add click event listeners to the login and logout buttons
  document.getElementById('login-btn-1').addEventListener('click', handleLogin);
  document.getElementById('login-btn-2').addEventListener('click', handleLogin);
  //document.getElementById('logout-btn').addEventListener('click', handleLogout);
});
