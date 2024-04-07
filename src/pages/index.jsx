import React from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
  // session is always non-null inside this page, all the way down the React tree.
  return "Some super secret dashboard";
};

Home.auth = true;

export default Home;
