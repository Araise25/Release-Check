export default {
	async fetch(request: Request, env: any): Promise<Response> {
		// CORS headers
		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		};

		// Handle CORS preflight request
		if (request.method === "OPTIONS") {
			return new Response(null, {
				headers: corsHeaders
			});
		}

		// Only allow POST requests
		if (request.method !== "POST") {
			return new Response("Only POST allowed", {
				status: 405,
				headers: corsHeaders
			});
		}

		const data = await request.json() as {
			name: string;
			category: string;
			releaseYear: string;
			releaseDate: string;
			link: string;
			description: string;
		};

		const issue = {
			title: `[New Submission] ${data.name}`,
			body: `
### New Technology Submission

- **Name:** ${data.name}
- **Category:** ${data.category}
- **Release Year:** ${data.releaseYear}
- **Release Date:** ${data.releaseDate || "N/A"}
- **Documentation Link:** ${data.link || "N/A"}

### Notes
${data.description || "No description provided."}

---

*Submitted via Release Check App (Cloudflare Worker API)*  
      `
		};

		const response = await fetch(
			"https://api.github.com/repos/Araise25/Release-Check-DB/issues",
			{
				method: "POST",
				headers: {
					"Authorization": `Bearer ${env.GITHUB_TOKEN}`,
					"Content-Type": "application/json",
					"User-Agent": "ReleaseCheckBot"
				},
				body: JSON.stringify(issue)
			}
		);

		if (!response.ok) {
			const text = await response.text();
			return new Response(JSON.stringify({ ok: false, error: text }), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
					...corsHeaders
				}
			});
		}

		return new Response(JSON.stringify({ ok: true }), {
			headers: {
				"Content-Type": "application/json",
				...corsHeaders
			}
		});
	}
};
