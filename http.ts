export async function sendPostRequest(url: string, body: any) {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(body)
		});

		// Check if the request was successful
		if (!response.ok) {
			throw new Error(`Request failed with status: ${response.status}`);
		}

		// Parse the response (assuming it's JSON)
		const data = await response.json();
		console.log("Response:", data);
		return data;
	} catch (error) {
		console.error("Error:", error);
	}
}

export async function sendGetRequest(url: string, auth: string) {
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: auth
			}
		});

		// Check if the request was successful
		if (!response.ok) {
			throw new Error(`Request failed with status: ${response.status}`);
		}

		// Parse the response (assuming it's JSON)
		const data = await response.json();
		console.log("Response:", data);
		return data;
	} catch (error) {
		console.error("Error:", error);
	}
}
