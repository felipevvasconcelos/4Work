import Head from "next/head";
import React from "react";
import { Layout, siteTittle } from "../components";
import { signIn, signOut, useSession } from "next-auth/client";

export default function Home() {
	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
		</Layout>
	);
}
