import Head from "next/head";
import React from "react";
import { Layout, siteTittle } from "../../components";

export default function Improvement() {
	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<h1>This is Improvements</h1>
		</Layout>
	);
}
