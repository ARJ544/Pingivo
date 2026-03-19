import HomeClient from "@/app/HomeClient";
import { authenticateUser, refreshUserToken } from "@/lib/api-helpers";
import { getAllCookie } from "@/app/actions";

export default async function Home() {
  const { id, loggedin } = await getAllCookie();

  if (!id) {
    return <HomeClient token={undefined} loggedin={loggedin} bsuid={undefined} />;
  }

  const auth = await authenticateUser(false);

  if (!auth.success) {
    return <HomeClient token={undefined} loggedin={loggedin} bsuid={undefined} />;
  }

  if (!auth.user.token && !auth.user.bsuid) {
    const refreshedToken = await refreshUserToken(auth.user.id);
    if (!refreshedToken.success) {
      return <HomeClient token={auth.user.token} loggedin={loggedin} bsuid={undefined} />;
    }
    return <HomeClient token={refreshedToken.token} loggedin={loggedin} bsuid={undefined} />;
  }


  return (
    <HomeClient
      token={auth.user.token}
      loggedin={loggedin}
      bsuid={auth.user.bsuid}
    />
  );
}
