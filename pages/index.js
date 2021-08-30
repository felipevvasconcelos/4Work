import Head from "next/head";
import React from "react";
import { AppointmentDialog, Layout, ListNotifications, siteTittle } from "../components";

export default function Home() {
	return (
		<Layout>
			<Head>
				<title>{siteTittle}</title>
			</Head>
		</Layout>
	);
}
