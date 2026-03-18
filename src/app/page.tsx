import HomeClient from "@/app/HomeClient";
import { authenticateUser, refreshUserToken } from "@/lib/api-helpers";
import { getAllCookie } from "@/app/actions";

export default async function Home() {
  const { id, loggedin, has_bsuid } = await getAllCookie();

  if (!id) {
    return <HomeClient token={undefined} loggedin={loggedin} bsuid={undefined} shouldSetBsuidCookie={false} />;
  }
  if (has_bsuid) {
    return <HomeClient token={undefined} loggedin={loggedin} bsuid={undefined} shouldSetBsuidCookie={false} />;
  }

  const auth = await authenticateUser(false);

  if (!auth.success) {
    return <HomeClient token={undefined} loggedin={loggedin} bsuid={undefined} shouldSetBsuidCookie={false} />;
  }

  if ((!auth.user.token && !auth.user.bsuid) || !auth.user.bsuid) {
    const refreshedToken = await refreshUserToken(auth.user.id);
    if (!refreshedToken.success) {
      return <HomeClient token={auth.user.token} loggedin={loggedin} bsuid={undefined} shouldSetBsuidCookie={false} />;
    }
    return <HomeClient token={refreshedToken.token} loggedin={loggedin} bsuid={undefined} shouldSetBsuidCookie={false} />;
  }


  return (
    <HomeClient
      token={auth.user.token}
      loggedin={loggedin}
      bsuid={auth.user.bsuid}
      shouldSetBsuidCookie={auth.shouldSetCookie ?? false}
    />
  );
}