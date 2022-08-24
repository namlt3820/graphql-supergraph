const subgraph_1_resolver = {
	Query: {
		subgraph_1: async (root, param, ctx, info) => {
			return {
				message1: "Hello from subgraph_1",
				anotherMessage: "Hi from github action",
			};
		},
		api_data: {
			__resolveReference() {
				return {
					api_data: {
						_id: "1",
						subgraph_1: {
							version: "subgraph_1_1.0.0",
							config: JSON.stringify({ name: "subgraph_1" }),
						},
					},
				};
			},
		},
	},
};

const subgraph_2_resolver = {
	Query: {
		subgraph_2: async (root, param, ctx, info) => ({
			message2: "Hello from subgraph_2",
			anotherMessage: "Test github action again",
		}),
		api_data: {
			__resolveReference() {
				return {
					api_data: {
						_id: "1",
						subgraph_2: {
							version: "subgraph_2_1.0.0",
							config: JSON.stringify({ name: "subgraph_2" }),
						},
					},
				};
			},
		},
	},
};

export { subgraph_1_resolver, subgraph_2_resolver };
