import Head from "next/head";
import React from "react";
import { Layout, siteTittle } from "../../components";

export default function DashBoard() {
	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<h1>This is Dash</h1>
		</Layout>
	);
}
