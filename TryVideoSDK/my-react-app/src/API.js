//This is the Auth token, you will use it to generate a meeting and connect to it
// export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJhMWEwY2ZiYi0wODgyLTRkZDUtOTlmMC1hN2MyMDE4YTM3MWIiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0ODIyNDgxMCwiZXhwIjoxNzQ4MzExMjEwfQ.niVvDnjIjgK8JbjM0eYw8gaHWTHk6ZrYOSkkxTYrrh8";
export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIzNjFjM2Q1OS1hMDAxLTQ3MGItYTM1ZC02ZDhlYWM4YmFmZmEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc0ODk4NTgxMiwiZXhwIjoxNzgwNTIxODEyfQ.F-MO00o9tCO8Mxa9zp8SJThTalXqghgGiI3_eFln29M";
// API call to create a meeting
export const createMeeting = async ({ token }) => {
  console.log("token", token);

  const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();
  return roomId;
};