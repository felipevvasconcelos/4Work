import Head from "next/head";
import React from "react";
import { Layout, siteTittle } from "../../components";
import { useRouter } from "next/router";

export default function TaskById() {
	const route = useRouter();

	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
			<h1>This is a Task {route.query.id} </h1>
		</Layout>
	);
}
