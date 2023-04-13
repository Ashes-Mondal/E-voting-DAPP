export const savePrivateKey = (privateKeyHEX,voterID,username) => {
	try {
		const link = document.createElement("a");
		const blob = new Blob([privateKeyHEX], { type: "text/plain;charset=hex" });
		// Add file content in the object URL
		link.href = URL.createObjectURL(blob);

		// Add file name
		link.download = `${voterID}_${username}.pem`;

		// Add click event to <a> tag to save file.
		link.click();
		URL.revokeObjectURL(link.href);
	} catch (error) {
		console.error("Failed to save!", error);
	}
}

