import Elysia from "elysia";

type UserFromToken = {
  name: string;
  email: string;
};

export const isAuthenticated = new Elysia().derive(
  // @ts-ignore
  async ({ request: { headers }, set, jwt }) => {
    const authHeader = headers.get("Authorization");
    if (!authHeader)
      return {
        data: null,
      };

    const user = await jwt.verify(authHeader.replace("Bearer ", ""));
    if (!user)
      return {
        data: null,
      };

    return {
      data: user as UserFromToken,
    };
  },
);
