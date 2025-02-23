import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function RootPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken")?.value;

  try {
    if (!token) {
      return redirectToLogin();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return redirectToHome();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return redirectToLogin();
  }
}

function redirectToLogin() {
  return <script>{`window.location.href = "/login";`}</script>;
}

function redirectToHome() {
  return <script>{`window.location.href = "/home";`}</script>;
}
