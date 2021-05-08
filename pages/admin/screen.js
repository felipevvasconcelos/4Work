import Head from "next/head";
import React from "react";
import { Layout, siteTittle } from "../../components";

export default function Screen() {
	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<h1>This is Screens</h1>
		</Layout>
	);
}
