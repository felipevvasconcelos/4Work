import Head from "next/head";
import React from "react";
import { Layout, siteTittle } from "../components";

export default function Home() {
	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
		</Layout>
	);
}
