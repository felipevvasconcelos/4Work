export function emailLogin({ url, host, email }) {
	const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
	const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

	const backgroundColor = "#f9f9f9";
	const textColor = "#ffffff";
	const mainBackgroundColor = "#000000";
	const buttonBackgroundColor = "##cc6828";
	const buttonBorderColor = "#cc6828";
	const buttonTextColor = "#ffffff";

	return `
  <body style="background: ${backgroundColor};">
	<table width="100%" border="0" cellspacing="0" cellpadding="0">
	  <tr>
		<td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: #000000;">
		  <strong>${escapedHost}</strong>
		</td>
	  </tr>
	</table>
	<table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
	  <tr>
		<td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  Entrar como <strong>${escapedEmail}</strong>
		</td>
	  </tr>
	  <tr>
		<td align="center" style="padding: 20px 0;">
		  <table border="0" cellspacing="0" cellpadding="0">
			<tr>
			  <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Entrar</a></td>
			</tr>
		  </table>
		</td>
	  </tr>
	  <tr>
		<td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
		  Se você não solicitou esse e-mail, por favor, desconsiderar.
		</td>
	  </tr>
	</table>
  </body>
  `;
}

export function titleEmailLogin({ url, host }) {
	return `Entrar no ${host}\n${url}\n\n`;
}
