document.addEventListener('DOMContentLoaded', function () {

  const loginContainer = document.getElementById('login-container');
  const welcomeContainer = document.getElementById('welcome-container');
  const usernameSpan = document.getElementById('username');



  // Function to show the login screen
  const showLoginScreen = () => {
    loginContainer.style.display = 'block';
    welcomeContainer.style.display = 'none';
  };

  // Function to show the welcome screen
  const showWelcomeScreen = (username) => {
    loginContainer.style.display = 'none';
    welcomeContainer.style.display = 'block';
    usernameSpan.textContent = username;
  };

  // Function to handle the login button click
  const handleLogin = () => {
    const clientId = '5ogo4t9c3l3hh7kp15irq5rdu4';
    const redirectUri = 'http://localhost:63342/project-smith-main/index2.html'; // Should match the one used in the original authorization request

    // Initiate the Cognito hosted UI login
    const loginUrl = `https://smith-project.auth.us-west-2.amazoncognito.com/login?response_type=token&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  };

  // Check if there's a valid authorization code in the URL after login
  const urlParams = new URLSearchParams(window.location.hash);
  //const authorizationCode = urlParams.get('code');
  const id_token = urlParams.get('#id_token');
  const access_token = urlParams.get('access_token');
  const token_type = urlParams.get('token_type');
  const expires_in = urlParams.get('expires_in');

  console.log("id_token:", id_token )
  console.log("access_token:", access_token )
  console.log("token_type:", token_type )
  console.log("expires_in:", expires_in )

  var awsRegion = 'us-west-2';
  AWS.config.region = awsRegion;

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
          console.log("Logged In")
        }
      });
    }

  getCredentialsWithCognitoToken("eyJraWQiOiJcL3VGNUZ6bmlzdHVZa093ZUdKcUI2V2ZkWk9Wa3BocGlcL2xrbjdYWlNvUnM9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiNXI2T0ZxbVhzQjBYS0JxMi1CUnZxUSIsInN1YiI6ImQ4MzFlMzEwLTYwZDEtNzBlYy0xMzZlLWVkY2ZiMDkyMzA4NyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9WRDUyWHRoNnciLCJjb2duaXRvOnVzZXJuYW1lIjoiZGFueXN0aW5zb24iLCJhdWQiOiI1b2dvNHQ5YzNsM2hoN2twMTVpcnE1cmR1NCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjkwNTM3ODUwLCJleHAiOjE2OTA1NDE0NTAsImlhdCI6MTY5MDUzNzg1MSwianRpIjoiN2Q3ZjMyN2YtNGIzMC00ZDc0LWJlZTEtMDc5Yjg5NmNiNTU5IiwiZW1haWwiOiJidXplY2RAYW1hem9uLmNvbSJ9.HfbovDhinIdAfqSGq20HUSecyLn7Tvsf2AfeO-IcLMSzH9DfvE1BmVoM6RM-ddRABc6sy_kOgukR9bJ-6ZLIQYsoilMoRNne44x98hGjACDBipPR3kg3D88rQcIULlsmP0vUnULRM0Ffoq3ICDHvfFqEqKbTXStt0AHz105Myn9l4c-WsoxgsVgRpu8Sv-rUIqRL7cTul42dpdBt_Sb5UWkyDKtvO7BT0K7TWEEoxGEhbEDgq27ZoKbwzjihhAFbrmJCfAXRgS-1Azywxj6mqPxIRt3mlv03BX7vuCgF43XzQ7XT6gqPsjhFWqfIQ6oB6FN9pda68tJsAdPjlHZEdQ")

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
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
});
