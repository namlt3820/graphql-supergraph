const subgraph_1_resolver = {
	Query: {
		subgraph_1: async (root, param, ctx, info) => {
			console.log("request from super graph");
			return {
				message: "Hello from subgraph_1",
			};
		},
	},
};

const subgraph_2_resolver = {
	Query: {
		subgraph_2: async (root, param, ctx, info) => ({
			message: "Hello from subgraph_2",
		}),
	},
};

export { subgraph_1_resolver, subgraph_2_resolver };
