import { Request, Response, Router } from "express";
import userController from "../controllers/userController.js";
import validateSchemaMiddleware from "../middlewares/validateSchemaMiddleware.js";
import userSchema from "../schemas/userSchema.js";
import axios from "axios";
import validateAuth from "../middlewares/validateAuthenticatedMiddleware.js";

const userRouter = Router();

userRouter.post("/register", validateSchemaMiddleware(userSchema), userController.register);
userRouter.post("/login", validateSchemaMiddleware(userSchema), userController.login);
userRouter.post("/login/github", userController.loginWithGithub);
// userRouter.get("/validateAuth", validateAuth, (req: Request, res: Response) => {
//   res.sendStatus(200);
// });

userRouter.get("/github/callback", (req, res) => {
  const requestToken = req.query.code;

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.SECRET_KEY}&code=${requestToken}&scope=user:email`,
    headers: {
      accept: "application/json",
    },
  })
    .then((response) => {
      const access_token = response.data.access_token;
      res.send({ access_token });
    })
    .catch((error) => res.send(error));
});

userRouter.get("/success", function (req, res) {
  let access_token = req.query.access_token;

  axios({
    method: "get",
    url: `https://api.github.com/user/emails`,
    headers: {
      Authorization: "token " + access_token,
    },
  })
    .then((response) => {
      res.send({ userData: response.data });
    })
    .catch((error) => console.log(error.message));
});

export default userRouter;
