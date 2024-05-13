import { useEffect } from "react";

import { SessionProvider } from "next-auth/react";
import { useSession } from "next-auth/react";

import CircularProgress from "@mui/material/CircularProgress";

import "../globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/service-worker.js").then(
          function (registration) {
            console.log(
              "Service Worker registered with scope:",
              registration.scope
            );
          },
          function (err) {
            console.log("Service Worker registration failed:", err);
          }
        );
      });
    }
  }, []);

  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return children;
}
