import axios from "axios";
const verify_token = async (authorization: string) => {
	const query = `
                query auth {
                    auth 
                }`;
	const headers = { authorization };

	const {
		data: {
			data: { auth },
		},
	} = await axios.post(
		SUPERGRAPH_URL,
		{ query },
		{ headers, timeout: 5000 }
	);

	return auth;
};

const subgraph_1_resolver = {
	Query: {
		subgraph_1: async (root, param, ctx, info) => {
			const {
				req: {
					headers: { authorization = "" },
				},
			} = ctx;
			const message = (await verify_token(authorization))
				? "Hello from subgraph_1"
				: "Authen failed";

			return {
				message,
			};
		},
	},
};

const subgraph_2_resolver = {
	Query: {
		subgraph_2: async (root, param, ctx, info) => {
			const {
				req: {
					headers: { authorization = "" },
				},
			} = ctx;
			const message = (await verify_token(authorization))
				? "Hello from subgraph_2"
				: "Authen failed";

			return {
				message,
			};
		},
	},
};

const subgraph_auth_resolver = {
	Query: {
		auth: (root, param, ctx, info) => {
			const {
				req: {
					headers: { authorization },
				},
			} = ctx;
			return authorization === "Bearer";
		},
	},
};

export { subgraph_1_resolver, subgraph_2_resolver, subgraph_auth_resolver };
