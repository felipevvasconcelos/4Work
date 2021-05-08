import Head from "next/head";
import React from "react";
import { Layout, siteTittle } from "../../components";

export default function Permission() {
	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<h1>This is Permissions</h1>
		</Layout>
	);
}
