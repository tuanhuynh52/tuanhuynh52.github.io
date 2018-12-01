Description: 

? SkyCast would like their users to be able to enter in any location and retrieve current and useful information

about the weather in that area, as well as a future forecast.

? Include charts for historic weather information about that area using any visualization library of your choice,

allowing the user to see relevant information within a reasonable time period.

? Additionally, the team feels that allowing a user to track his or her search history would be a valuable addition,

and would like to see a way of storing queries made by a specific user between browser sessions.

APIs To Use:

- (https://developer.forecast.io)
- combined with geolocation API + firebase

What I did:

- Generating a login /registration form using Firebase
- Searched location will be added to the log if the user wants it to be, it won't lost even the user logged out
because the data will be saved to Firebase.
- Generating current location and retrieve latlng coordinations for darksky api. 
- Creating some front-end of the web
- Using AJAX, JQuery for some dedicated functions. 

Issues: 

- The domain which I had to pay for GoDaddy is not secured due to budget, it may occur error when you test it 
on Google Chrome. 
- The domain from Godaddy also unecpected loses its connection. I was really upset about it but paid for it already.
  